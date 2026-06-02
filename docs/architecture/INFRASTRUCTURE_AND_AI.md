# RestroVerse — Infrastructure, Security & AI Architecture

---

## PART 1: INFRASTRUCTURE

### 1.1 Production Architecture

```
                                    ┌──────────────┐
                                    │  CloudFlare  │
                                    │  CDN + WAF   │
                                    │  + DNS       │
                                    └──────┬───────┘
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                     ┌────────▼────────┐     ┌──────────▼─────────┐
                     │  nginx LB       │     │  nginx LB          │
                     │  (HTTP/REST)    │     │  (WebSocket)       │
                     └────────┬────────┘     └──────────┬─────────┘
                              │                         │
              ┌───────────────┼───────────────┐         │
              │               │               │         │
       ┌──────▼─────┐ ┌──────▼─────┐ ┌───────▼────┐ ┌──▼──────────┐
       │ API Srv 1  │ │ API Srv 2  │ │ API Srv 3  │ │ WS Srv 1-3  │
       │ Fastify    │ │ Fastify    │ │ Fastify    │ │ Socket.io   │
       │ (Node 20)  │ │ (Node 20)  │ │ (Node 20)  │ │ (Node 20)   │
       └──────┬─────┘ └──────┬─────┘ └──────┬─────┘ └──────┬──────┘
              │               │              │              │
              └───────────────┼──────────────┘              │
                              │                             │
         ┌────────────────────┼─────────────────────────────┘
         │                    │
    ┌────▼────┐    ┌──────────▼──────────────────────────────────┐
    │  NATS   │    │              DATA LAYER                     │
    │  Queue  │    │                                             │
    └────┬────┘    │  ┌────────────┐  ┌───────┐  ┌───────────┐  │
         │         │  │ PostgreSQL │  │ Redis │  │ClickHouse│  │
         │         │  │ Primary    │  │Cluster│  │(Analytics)│  │
    ┌────▼────┐    │  │   ┌──────┐ │  │       │  │           │  │
    │ Workers │    │  │   │Read 1│ │  └───────┘  └───────────┘  │
    │ (async) │    │  │   │Read 2│ │                             │
    └─────────┘    │  │   └──────┘ │  ┌───────┐                 │
                   │  └────────────┘  │ MinIO │                 │
                   │                  │  (S3)  │                 │
                   │                  └───────┘                 │
                   └────────────────────────────────────────────┘
                              │
         ┌────────────────────┼──────────────────┐
         │                    │                  │
    ┌────▼──────┐    ┌───────▼───────┐   ┌──────▼──────┐
    │ AI Service│    │ WhatsApp      │   │ SMS Gateway │
    │ FastAPI   │    │ Connector     │   │ Sparrow/    │
    │ (Python)  │    │ (Node)        │   │ MSG91       │
    │ GPU opt.  │    └───────────────┘   └─────────────┘
    └───────────┘
         │
    ┌────▼──────┐
    │ ML Models │
    │ Whisper   │
    │ Tesseract │
    │ Prophet   │
    └───────────┘

    ┌─────────────────────────────────────────────┐
    │            MONITORING STACK                  │
    │  Prometheus → Grafana (dashboards)           │
    │  Loki (logs) → Grafana (log explorer)        │
    │  Alertmanager → Slack/WhatsApp alerts        │
    └─────────────────────────────────────────────┘
```

### 1.2 Docker Compose (Local Dev)

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: restroverse
      POSTGRES_USER: restroverse
      POSTGRES_PASSWORD: devpassword123
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U restroverse"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  clickhouse:
    image: clickhouse/clickhouse-server:24-alpine
    ports:
      - "8123:8123"   # HTTP
      - "9000:9000"   # Native
    volumes:
      - clickdata:/var/lib/clickhouse
    environment:
      CLICKHOUSE_DB: restroverse_analytics
      CLICKHOUSE_USER: default
      CLICKHOUSE_PASSWORD: devpassword123

  minio:
    image: minio/minio:latest
    ports:
      - "9090:9000"   # API
      - "9091:9001"   # Console
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    volumes:
      - miniodata:/data

  nats:
    image: nats:2-alpine
    ports:
      - "4222:4222"   # Client
      - "8222:8222"   # Monitoring
    command: --jetstream --store_dir=/data
    volumes:
      - natsdata:/data

  api:
    build:
      context: .
      dockerfile: docker/Dockerfile.api
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://restroverse:devpassword123@postgres:5432/restroverse
      REDIS_URL: redis://redis:6379
      NATS_URL: nats://nats:4222
      MINIO_ENDPOINT: minio
      MINIO_PORT: "9000"
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin123
      JWT_SECRET: dev-jwt-secret-change-in-prod
      JWT_REFRESH_SECRET: dev-refresh-secret-change-in-prod
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      nats:
        condition: service_started
    volumes:
      - ./apps/api/src:/app/src

  web:
    build:
      context: .
      dockerfile: docker/Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NEXT_PUBLIC_WS_URL: ws://localhost:3001
    depends_on:
      - api
    volumes:
      - ./apps/web/src:/app/src

  ai:
    build:
      context: .
      dockerfile: docker/Dockerfile.ai
    ports:
      - "8000:8000"
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY:-sk-dev}
      WHISPER_MODEL: small
      DATABASE_URL: postgres://restroverse:devpassword123@postgres:5432/restroverse
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./apps/ai/src:/app/src
      - aimodels:/app/models

volumes:
  pgdata:
  redisdata:
  clickdata:
  miniodata:
  natsdata:
  aimodels:
```

### 1.3 Kubernetes — API Deployment

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: restroverse-api
  labels:
    app: restroverse-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: restroverse-api
  template:
    metadata:
      labels:
        app: restroverse-api
    spec:
      containers:
        - name: api
          image: ghcr.io/restroverse/api:latest
          ports:
            - containerPort: 3001
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: restroverse-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: restroverse-secrets
                  key: redis-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: restroverse-secrets
                  key: jwt-secret
          livenessProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 10
            periodSeconds: 15
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: restroverse-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: restroverse-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "500"
---
apiVersion: v1
kind: Service
metadata:
  name: restroverse-api-svc
spec:
  selector:
    app: restroverse-api
  ports:
    - port: 80
      targetPort: 3001
  type: ClusterIP
```

### 1.4 CI/CD — GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  API_IMAGE: ghcr.io/${{ github.repository }}/api
  WEB_IMAGE: ghcr.io/${{ github.repository }}/web
  AI_IMAGE: ghcr.io/${{ github.repository }}/ai

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: restroverse_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ["5432:5432"]
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports: ["6379:6379"]

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test -- --coverage
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/restroverse_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret

      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build-and-deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: []
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/Dockerfile.api
          push: true
          tags: ${{ env.API_IMAGE }}:${{ github.sha }},${{ env.API_IMAGE }}:latest

      - uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/Dockerfile.web
          push: true
          tags: ${{ env.WEB_IMAGE }}:${{ github.sha }},${{ env.WEB_IMAGE }}:latest

      - name: Deploy to production
        run: |
          # Update k8s deployment with new image
          kubectl set image deployment/restroverse-api \
            api=${{ env.API_IMAGE }}:${{ github.sha }}
          kubectl set image deployment/restroverse-web \
            web=${{ env.WEB_IMAGE }}:${{ github.sha }}
          kubectl rollout status deployment/restroverse-api --timeout=300s
          kubectl rollout status deployment/restroverse-web --timeout=300s
```

### 1.5 Monitoring

**Key Prometheus Alert Rules:**

```yaml
# prometheus/alerts.yml
groups:
  - name: restroverse-alerts
    rules:
      - alert: HighAPILatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels: { severity: warning }
        annotations: { summary: "API p95 latency > 500ms" }

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
        for: 3m
        labels: { severity: critical }
        annotations: { summary: "Error rate > 1%" }

      - alert: DatabaseConnectionsHigh
        expr: pg_stat_activity_count / pg_settings_max_connections > 0.8
        for: 5m
        labels: { severity: warning }
        annotations: { summary: "DB connections > 80%" }

      - alert: SyncQueueBacklog
        expr: restroverse_sync_queue_depth > 1000
        for: 10m
        labels: { severity: warning }
        annotations: { summary: "Sync queue backlog > 1000 changes" }

      - alert: DiskSpaceHigh
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.15
        for: 10m
        labels: { severity: critical }
        annotations: { summary: "Disk space < 15% remaining" }

      - alert: RedisMemoryHigh
        expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.85
        for: 5m
        labels: { severity: warning }

      - alert: WebSocketConnectionsDrop
        expr: delta(restroverse_ws_connections_total[5m]) < -100
        for: 2m
        labels: { severity: warning }
        annotations: { summary: "WebSocket connections dropped by >100 in 5m" }
```

**Grafana Dashboard Panels:**
1. API requests/sec by endpoint
2. API latency p50/p95/p99
3. Active WebSocket connections
4. Orders created per minute
5. Sync queue depth (pending changes)
6. Active restaurants (last 1hr)
7. Database query latency
8. Redis hit/miss ratio
9. Error rate by endpoint
10. AI service latency (voice/OCR)

### 1.6 Backup & DR

```bash
#!/bin/bash
# scripts/backup.sh — runs daily via cron

# PostgreSQL: WAL archiving (continuous) + daily full backup
pg_dump -Fc -h $DB_HOST -U $DB_USER $DB_NAME | \
  aws s3 cp - s3://restroverse-backups/pg/$(date +%Y-%m-%d).dump \
  --storage-class STANDARD_IA

# Redis: RDB snapshot
redis-cli -h $REDIS_HOST BGSAVE
aws s3 cp /data/dump.rdb s3://restroverse-backups/redis/$(date +%Y-%m-%d).rdb

# ClickHouse: table backup
clickhouse-client --query "BACKUP TABLE restroverse_analytics.events TO S3('s3://restroverse-backups/ch/$(date +%Y-%m-%d)/')"

# Retention: keep 30 daily, 12 monthly, 3 yearly
aws s3 lifecycle-configuration --bucket restroverse-backups ...
```

| Metric | Target |
|---|---|
| RPO (Recovery Point) | 1 hour (WAL archiving is continuous) |
| RTO (Recovery Time) | 4 hours |
| Backup frequency | Continuous WAL + daily full |
| Retention | 30 daily, 12 monthly |
| DR region | AWS Singapore (secondary) |

### 1.7 Multi-Region

```
PRIMARY: AWS Mumbai (ap-south-1)
  - All write traffic
  - API servers, PostgreSQL primary, Redis primary, ClickHouse
  - AI service (GPU instances)

CDN: CloudFlare (global edge)
  - Static assets (JS, CSS, images)
  - Menu photos (cached at edge)
  - QR menu pages (cached)
  - DDoS protection + WAF

ROUTING:
  Nepal traffic  → CloudFlare → Mumbai (latency ~20ms)
  India traffic  → CloudFlare → Mumbai (latency ~5ms)
  Bangladesh     → CloudFlare → Mumbai (latency ~30ms)

FUTURE (at scale):
  - PostgreSQL read replica in Singapore (for SE Asia expansion)
  - Redis replica per region
  - Regional API server pools
```

---

## PART 2: SECURITY

### 2.1 Authentication Flows

**Phone OTP Flow:**
```
Client                    API                     SMS Gateway
  │                        │                          │
  │ POST /auth/send-otp    │                          │
  │ {phone:"+977980..."}   │                          │
  │───────────────────────>│                          │
  │                        │ Generate 6-digit OTP     │
  │                        │ Store in Redis (5min TTL) │
  │                        │ POST /sms/send            │
  │                        │──────────────────────────>│
  │                        │         200 OK            │
  │                        │<──────────────────────────│
  │   {success, expiresIn} │                          │
  │<───────────────────────│                          │
  │                        │                          │
  │ POST /auth/verify-otp  │                          │
  │ {phone, otp:"452389"}  │                          │
  │───────────────────────>│                          │
  │                        │ Verify OTP from Redis     │
  │                        │ Find/create user          │
  │                        │ Generate JWT (15min)      │
  │                        │ Generate refresh (30d)    │
  │                        │ Register device           │
  │   {token, refresh,     │                          │
  │    user, restaurant}   │                          │
  │<───────────────────────│                          │
```

**Staff PIN Switch (Shared POS Tablet):**
```
Staff taps "Switch User" → enters 4-digit PIN
  │
  POST /auth/staff-pin {pin:"1234", restaurantId:"uuid"}
  │
  API: lookup user by (restaurant_id, pin)
  │    verify is_active = true
  │    issue new JWT with user context
  │    log device switch in audit_log
  │
  Response: {token, user:{name,role,permissions}}
  │
  POS UI updates: shows staff name, applies role permissions
  (No full re-auth needed — seamless handoff)
```

**Token Refresh:**
```
Client detects JWT expired (or 401 response)
  │
  POST /auth/refresh {refreshToken:"rt_..."}
  │
  API: validate refresh token (not revoked, not expired)
  │    issue new JWT (15min) + new refresh token (30d)
  │    revoke old refresh token (rotation)
  │
  Response: {token, refreshToken}
  │
  Client stores new tokens, retries original request
```

### 2.2 Row-Level Security Policies

```sql
-- Application sets this on each database connection:
-- SET app.restaurant_id = '<uuid>';
-- SET app.user_role = 'manager';
-- SET app.is_superadmin = 'false';

-- Helper function
CREATE OR REPLACE FUNCTION current_restaurant_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.restaurant_id', true), '')::UUID;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION is_superadmin() RETURNS BOOLEAN AS $$
  SELECT COALESCE(current_setting('app.is_superadmin', true)::boolean, false);
$$ LANGUAGE sql STABLE;

-- Apply to all tenant tables (example for key tables):

-- ORDERS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_tenant ON orders
  USING (restaurant_id = current_restaurant_id() OR is_superadmin());
CREATE POLICY orders_insert ON orders FOR INSERT
  WITH CHECK (restaurant_id = current_restaurant_id());

-- BILLS
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY bills_tenant ON bills
  USING (restaurant_id = current_restaurant_id() OR is_superadmin());

-- MENU ITEMS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY menu_tenant ON menu_items
  USING (restaurant_id = current_restaurant_id() OR is_superadmin());

-- CUSTOMERS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_tenant ON customers
  USING (restaurant_id = current_restaurant_id() OR is_superadmin());

-- INVENTORY
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY inventory_tenant ON inventory_items
  USING (restaurant_id = current_restaurant_id() OR is_superadmin());

-- KITCHEN TICKETS
ALTER TABLE kitchen_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY kitchen_tenant ON kitchen_tickets
  USING (restaurant_id = current_restaurant_id() OR is_superadmin());

-- AUDIT LOG (read-only for non-superadmin)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_read ON audit_log FOR SELECT
  USING (restaurant_id = current_restaurant_id() OR is_superadmin());
CREATE POLICY audit_insert ON audit_log FOR INSERT
  WITH CHECK (true);  -- anyone can insert audit entries
```

### 2.3 RBAC Permission Matrix

| Permission | Owner | Manager | Cashier | Waiter | Kitchen | Delivery |
|---|---|---|---|---|---|---|
| **Orders** |
| view_orders | ✅ | ✅ | ✅ | ✅ own | ✅ kitchen | ✅ own |
| create_orders | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| modify_orders | ✅ | ✅ | ✅ | ✅ own | ❌ | ❌ |
| cancel_orders | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| void_items | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Billing** |
| create_bills | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| process_payments | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| apply_discount | ✅ | ✅ ≤30% | ✅ ≤10% | ❌ | ❌ | ❌ |
| void_bill | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| process_refund | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| view_daily_settlement | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Menu** |
| view_menu | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| manage_menu | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| toggle_availability | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Tables** |
| view_tables | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| manage_tables | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Kitchen** |
| view_kitchen | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| update_kot_status | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Inventory** |
| view_inventory | ✅ | ✅ | ❌ | ❌ | ✅ view | ❌ |
| manage_inventory | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| create_purchase_orders | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| log_waste | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Staff** |
| view_staff | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| manage_staff | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| manage_shifts | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| view_payroll | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Customers** |
| view_customers | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| manage_customers | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| manage_khata | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| send_marketing | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Analytics** |
| view_reports | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| view_dashboard | ✅ | ✅ | ✅ summary | ❌ | ❌ | ❌ |
| export_data | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Settings** |
| manage_settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| manage_integrations | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Delivery** |
| view_deliveries | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ own |
| manage_delivery | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| update_delivery_status | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ own |

### 2.4 Data Protection

```
ENCRYPTION AT REST:
├── PostgreSQL: Full disk encryption (AWS EBS encryption, AES-256)
├── Sensitive columns: application-layer encryption using libsodium
│   ├── users.pin → bcrypt hash
│   ├── payment gateway credentials → AES-256-GCM
│   └── customer phone → stored plain for lookup, but encrypted in backups
├── Backups: encrypted at rest on S3 (SSE-S3)
└── Redis: encrypted volume

ENCRYPTION IN TRANSIT:
├── TLS 1.3 on all external connections
├── Certificate pinning on mobile apps (prevents MITM)
├── Internal services: mTLS between API ↔ Database ↔ Redis
└── WebSocket: wss:// only

PAYMENT SECURITY:
├── Never store card numbers — tokenize via gateway
├── Payment credentials: encrypted in DB, decrypted only at API layer
├── PCI DSS compliance: outsource to certified gateways (eSewa, Khalti, Razorpay)
├── All payment operations logged in audit_log
└── Refunds require manager+ role

AUDIT TRAIL:
├── audit_log table: append-only (no UPDATE, no DELETE)
├── Every mutation logged: {user_id, device_id, action, entity_type, entity_id, old_data, new_data}
├── Retention: 7 years for financial records
├── Tamper-proof: hash chain (each entry includes hash of previous)
└── Exportable for regulatory compliance
```

---

## PART 3: AI/ML PIPELINE

### 3.1 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    AI SERVICE (FastAPI)                   │
│                    Port: 8000                             │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   AI ROUTER                         │ │
│  │  POST /ai/voice-to-order                            │ │
│  │  POST /ai/scan-invoice                              │ │
│  │  POST /ai/ask                                       │ │
│  │  GET  /ai/forecast/:restaurantId                    │ │
│  │  GET  /ai/menu-doctor/:restaurantId                 │ │
│  │  GET  /ai/anomalies/:restaurantId                   │ │
│  │  POST /ai/enhance-photo                             │ │
│  └──────────────┬──────────────────────────────────────┘ │
│                 │                                        │
│    ┌────────────┼────────────┬──────────────┐            │
│    │            │            │              │            │
│  ┌─▼──────┐ ┌──▼─────┐ ┌───▼────┐ ┌───────▼──────┐    │
│  │ VOICE  │ │ VISION │ │  NLP   │ │  ANALYTICS   │    │
│  │        │ │        │ │        │ │              │    │
│  │Whisper │ │Tesseract│ │OpenAI │ │Prophet       │    │
│  │(ONNX)  │ │+Custom │ │GPT API │ │LightGBM      │    │
│  │        │ │Devnagri│ │        │ │Isolation     │    │
│  │Ne/Hi/En│ │Bengali │ │        │ │Forest        │    │
│  └────────┘ └────────┘ └────────┘ └──────────────┘    │
│                                                          │
│  ON-DEVICE (ONNX Runtime in React Native):               │
│  ├── Whisper small (voice → text, works offline)         │
│  ├── Basic menu matching (fuzzy search, offline)         │
│  └── Tesseract lite (basic OCR, offline)                 │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Voice Ordering Pipeline

```
┌──────────────────────────────────────────────────────────┐
│  VOICE → ORDER PIPELINE                                  │
│                                                          │
│  1. CAPTURE                                              │
│     Staff taps 🎤 button, speaks:                        │
│     "दुई वटा चिकन मोमो र एउटा थुक्पा टेबल सात"            │
│     (2 chicken momo and 1 thukpa table 7)                │
│                                                          │
│  2. SPEECH-TO-TEXT                                        │
│     ┌─────────────────────────────────────┐              │
│     │ On-Device (offline):                │              │
│     │ Whisper small (ONNX) → Nepali text  │              │
│     │ Latency: ~2s on mid-range Android   │              │
│     │                                     │              │
│     │ Cloud fallback (if confidence <80%):│              │
│     │ Whisper large via API → text        │              │
│     └─────────────────────────────────────┘              │
│     Output: "दुई वटा चिकन मोमो र एउटा थुक्पा टेबल सात"  │
│                                                          │
│  3. NLP PARSING                                          │
│     Extract entities:                                    │
│     ├── items: [{name:"chicken momo", qty:2},            │
│     │           {name:"thukpa", qty:1}]                   │
│     ├── table: 7                                         │
│     ├── modifiers: [] (none spoken)                      │
│     └── confidence: 0.94                                 │
│                                                          │
│  4. MENU MATCHING                                        │
│     Fuzzy match against restaurant's menu:               │
│     ├── "chicken momo" → menu_item_id: "uuid" (99%)     │
│     ├── "thukpa" → menu_item_id: "uuid" (97%)           │
│     └── Uses Levenshtein + phonetic matching             │
│                                                          │
│  5. CONFIRMATION UI                                      │
│     ┌─────────────────────────────────┐                  │
│     │ 🎤 Voice Order — Confirm?       │                  │
│     │                                 │                  │
│     │ Table 7 · Dine-in               │                  │
│     │ ✅ Chicken Momo x2    Rs 400    │                  │
│     │ ✅ Thukpa x1          Rs 250    │                  │
│     │                                 │                  │
│     │ [✅ Confirm] [✏️ Edit] [🎤 Retry]│                  │
│     └─────────────────────────────────┘                  │
│                                                          │
│  6. ORDER CREATED → normal flow (KOT, kitchen, etc)      │
└──────────────────────────────────────────────────────────┘
```

### 3.3 Invoice OCR Pipeline

```
┌──────────────────────────────────────────────────────────┐
│  PHOTO → INVOICE PIPELINE                                │
│                                                          │
│  1. CAPTURE: Staff photographs supplier bill             │
│                                                          │
│  2. PREPROCESSING (OpenCV):                              │
│     ├── Deskew (correct rotation/tilt)                   │
│     ├── Binarize (adaptive threshold)                    │
│     ├── Contrast enhancement                             │
│     ├── Noise removal                                    │
│     └── Crop to content area                             │
│                                                          │
│  3. TEXT DETECTION:                                       │
│     ├── CRAFT model → detect text regions                │
│     └── Output: bounding boxes for each text line        │
│                                                          │
│  4. OCR:                                                 │
│     ├── Tesseract 5 with Devanagari + English trained    │
│     ├── Custom fine-tuned model for:                     │
│     │   ├── Nepali handwritten invoices                  │
│     │   ├── Hindi printed bills                          │
│     │   └── Bengali supplier receipts                    │
│     └── Output: raw text per region                      │
│                                                          │
│  5. STRUCTURED EXTRACTION (LLM):                         │
│     Prompt: "Extract supplier name, date, line items     │
│     (name, quantity, unit, unit_price, total) from:"     │
│     + OCR text                                           │
│                                                          │
│     Output:                                              │
│     {                                                    │
│       "supplier": "Season Agro Pvt Ltd",                 │
│       "date": "2026-05-27",                              │
│       "invoice_number": "INV-4521",                      │
│       "items": [                                         │
│         {"name":"Chicken","qty":10,"unit":"kg",          │
│          "unit_price":380,"total":3800,"confidence":0.95},│
│         {"name":"Cabbage","qty":5,"unit":"kg",           │
│          "unit_price":60,"total":300,"confidence":0.91}  │
│       ],                                                 │
│       "total": 4600                                      │
│     }                                                    │
│                                                          │
│  6. HUMAN VERIFICATION:                                  │
│     Fields with confidence < 85% highlighted for review  │
│     Staff corrects → saved → model learns (feedback loop)│
│                                                          │
│  7. AUTO-CREATE: Purchase order + stock movements        │
└──────────────────────────────────────────────────────────┘
```

### 3.4 Demand Forecasting

```python
# ai/services/forecast.py (simplified)

from prophet import Prophet
import lightgbm as lgb
import pandas as pd

class DemandForecaster:
    """Per-restaurant, per-item demand prediction."""

    def __init__(self, restaurant_id: str):
        self.restaurant_id = restaurant_id

    def get_features(self, item_id: str) -> pd.DataFrame:
        """Build feature set from historical data."""
        # Query last 90 days of sales for this item
        df = query_sales_history(self.restaurant_id, item_id, days=90)

        # Add features
        df['day_of_week'] = df['date'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        df['is_holiday'] = df['date'].apply(is_nepal_holiday)  # Dashain, Tihar, etc
        df['is_festival'] = df['date'].apply(is_festival_season)
        df['month'] = df['date'].dt.month
        df['week_of_month'] = df['date'].dt.day // 7
        df['weather'] = df['date'].apply(get_weather)  # rainy season etc
        df['lag_7d'] = df['quantity'].shift(7)
        df['rolling_7d_avg'] = df['quantity'].rolling(7).mean()
        df['rolling_30d_avg'] = df['quantity'].rolling(30).mean()

        return df

    def forecast(self, item_id: str, days_ahead: int = 3) -> list:
        """Predict demand for next N days."""
        df = self.get_features(item_id)

        # Prophet for trend + seasonality
        prophet_df = df[['date', 'quantity']].rename(
            columns={'date': 'ds', 'quantity': 'y'}
        )
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            holidays=get_nepal_holidays_df()  # Dashain, Tihar, Holi, Eid...
        )
        model.fit(prophet_df)
        future = model.make_future_dataframe(periods=days_ahead)
        forecast = model.predict(future)

        return [
            {
                "date": row['ds'].strftime('%Y-%m-%d'),
                "predicted_qty": max(0, round(row['yhat'])),
                "lower": max(0, round(row['yhat_lower'])),
                "upper": round(row['yhat_upper'])
            }
            for _, row in forecast.tail(days_ahead).iterrows()
        ]

    def generate_purchase_suggestions(self) -> list:
        """Generate PO suggestions for all items."""
        items = query_all_inventory_items(self.restaurant_id)
        suggestions = []

        for item in items:
            if not item.linked_menu_items:
                continue

            total_demand = 0
            for menu_item_id in item.linked_menu_items:
                forecast = self.forecast(menu_item_id, days_ahead=3)
                recipe_qty = get_recipe_quantity(menu_item_id, item.id)
                total_demand += sum(f['predicted_qty'] * recipe_qty for f in forecast)

            needed = total_demand - item.current_stock
            if needed > 0:
                suggestions.append({
                    "item": item.name,
                    "current_stock": item.current_stock,
                    "predicted_demand_3d": total_demand,
                    "suggested_order_qty": round(needed * 1.1),  # 10% buffer
                    "supplier": item.default_supplier,
                    "estimated_cost": round(needed * item.cost_per_unit)
                })

        return sorted(suggestions, key=lambda x: x['estimated_cost'], reverse=True)
```

### 3.5 Menu Engineering (Menu Doctor)

```
BCG MATRIX CLASSIFICATION:

                    HIGH POPULARITY
                         │
              ┌──────────┼──────────┐
              │          │          │
              │  PLOW-   │  STARS   │
              │  HORSES  │  ★★★     │
   LOW        │          │          │     HIGH
   PROFIT ────┼──────────┼──────────┼──── PROFIT
              │          │          │
              │  DOGS    │ PUZZLES  │
              │  🐕      │  ❓       │
              │          │          │
              └──────────┼──────────┘
                         │
                    LOW POPULARITY

STARS (High popularity + High profit):
  → Keep prominent on menu, maintain quality
  → Example: Chicken Momo (342 sold, 67% margin)

PLOWHORSES (High popularity + Low profit):
  → Increase price slightly or reduce portion/ingredients
  → Example: Veg Thali (201 sold, 28% margin)

PUZZLES (Low popularity + High profit):
  → Better placement, rename, add photo, promote
  → Example: Paneer Tikka (23 sold, 72% margin)

DOGS (Low popularity + Low profit):
  → Consider removing or complete rework
  → Example: Greek Salad (8 sold, 22% margin)

CROSS-RESTAURANT INSIGHTS (anonymized):
  "In Pokhara lakeside area, Paneer Momo sells 8x more than Pasta.
   Consider adding Paneer Momo (avg margin: 65%) and removing
   Pasta (your margin: 22%, area avg: 25%)."
```

### 3.6 Anomaly Detection

```python
# ai/services/anomaly.py

from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    """Detect suspicious patterns per restaurant."""

    FEATURES = [
        'void_count',          # number of voided items
        'void_amount',         # total value of voids
        'discount_count',      # discounts applied
        'discount_amount',     # total discount value
        'cash_pct',            # % of cash vs digital payments
        'avg_bill',            # average bill amount
        'transaction_count',   # total transactions
        'after_hours_txns',    # transactions outside business hours
        'refund_count',        # refunds issued
        'no_receipt_count',    # orders without printed/sent receipt
    ]

    def detect(self, restaurant_id: str, period_days: int = 7) -> list:
        """Find anomalies in recent activity."""

        # Get per-staff, per-day feature matrix
        data = query_staff_activity(restaurant_id, period_days)
        # data shape: [staff_id, date, void_count, void_amount, ...]

        if len(data) < 14:  # need minimum data
            return []

        X = data[self.FEATURES].values
        model = IsolationForest(contamination=0.1, random_state=42)
        predictions = model.fit_predict(X)

        anomalies = []
        for i, pred in enumerate(predictions):
            if pred == -1:  # anomaly
                row = data.iloc[i]
                reasons = self._explain(row, data)
                anomalies.append({
                    "staff_id": row['staff_id'],
                    "staff_name": row['staff_name'],
                    "date": row['date'],
                    "severity": self._severity(row, data),
                    "reasons": reasons,
                    "details": {f: float(row[f]) for f in self.FEATURES}
                })

        return sorted(anomalies, key=lambda x: x['severity'], reverse=True)

    def _explain(self, row, data) -> list:
        reasons = []
        for feat in self.FEATURES:
            mean = data[feat].mean()
            std = data[feat].std()
            if std > 0 and abs(row[feat] - mean) > 2 * std:
                direction = "above" if row[feat] > mean else "below"
                factor = round(row[feat] / mean, 1) if mean > 0 else "N/A"
                reasons.append(f"{feat} is {factor}x {direction} average")
        return reasons

    def _severity(self, row, data) -> str:
        z_scores = [(row[f] - data[f].mean()) / max(data[f].std(), 0.001)
                     for f in self.FEATURES]
        max_z = max(abs(z) for z in z_scores)
        if max_z > 4: return "critical"
        if max_z > 3: return "high"
        if max_z > 2: return "medium"
        return "low"
```

### 3.7 On-Device vs Cloud AI Matrix

| Feature | On-Device (ONNX) | Cloud API | Rationale |
|---|---|---|---|
| Voice → Text (Whisper) | ✅ small model | ✅ large model (fallback) | Must work offline for ordering |
| Text → Order Parse | ✅ rule-based + fuzzy | ✅ LLM-enhanced | Basic works offline, cloud for complex |
| Invoice OCR (basic) | ✅ Tesseract lite | ✅ full pipeline | Quick scan offline |
| Invoice → Structured | ❌ | ✅ LLM extraction | Needs LLM for accuracy |
| Demand Forecast | ❌ | ✅ Prophet + LightGBM | Needs 90 days history |
| Menu Engineering | ❌ | ✅ cross-restaurant | Needs network data |
| Anomaly Detection | ❌ | ✅ Isolation Forest | Pattern analysis |
| Chat with Data | ❌ | ✅ LLM + SQL | Needs full database |
| Food Photo Enhance | ❌ | ✅ diffusion model | GPU required |
| Customer Win-back | ❌ | ✅ automated | Needs scheduling |
| Smart Pricing | ❌ | ✅ optimization | Needs market data |

**On-device model sizes:**
- Whisper small (ONNX): ~150MB
- Tesseract Devanagari: ~30MB
- Fuzzy matcher index: ~5MB per restaurant menu
- Total on-device AI: ~200MB

---

## PART 4: INTEGRATIONS

### 4.1 Payment Gateway Adapter Pattern

```typescript
// packages/shared/src/payments/types.ts

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'completed' | 'failed';
  gatewayReference: string;
  redirectUrl?: string;      // for eSewa/Khalti redirect flow
  qrCodeUrl?: string;        // for UPI QR
  deepLink?: string;         // for app-to-app
  expiresAt: Date;
}

interface PaymentResult {
  success: boolean;
  reference: string;
  amount: number;
  method: string;
  gateway: string;
  rawResponse: Record<string, any>;
}

interface PaymentProvider {
  name: string;
  country: string;
  methods: string[];

  initiate(params: {
    amount: number;
    currency: string;
    orderId: string;
    customerPhone?: string;
    returnUrl: string;
  }): Promise<PaymentIntent>;

  verify(reference: string): Promise<PaymentResult>;

  refund(params: {
    reference: string;
    amount: number;
    reason: string;
  }): Promise<{ success: boolean; refundId: string }>;
}

// Adapters:
// - EsewaProvider    (Nepal)   → eSewa Web/App SDK
// - KhaltiProvider   (Nepal)   → Khalti payment gateway API
// - FonePayProvider  (Nepal)   → FonePay QR API
// - ConnectIPSProv   (Nepal)   → ConnectIPS bank transfer
// - RazorpayProvider (India)   → Razorpay (UPI, cards, wallets)
// - BkashProvider    (Bangladesh) → bKash payment API

// Usage:
// const provider = PaymentProviderFactory.get(country, method);
// const intent = await provider.initiate({amount: 870, ...});
// ... customer pays ...
// const result = await provider.verify(intent.gatewayReference);
```

### 4.2 Delivery Aggregator Integration

```
PATTERN: Webhook Receiver + Polling Hybrid

┌──────────────┐        ┌─────────────────────┐
│  Foodmandu   │──POST──│ /webhooks/foodmandu  │
│  Swiggy      │──POST──│ /webhooks/swiggy     │──→ Normalize → Create Order
│  Zomato      │──POST──│ /webhooks/zomato     │
│  Foodpanda   │──POST──│ /webhooks/foodpanda  │
└──────────────┘        └─────────────────────┘

Normalized order shape (internal):
{
  source: "foodmandu",
  externalId: "FM-12345",
  items: [{name, qty, price, notes}],
  customer: {name, phone, address},
  deliveryType: "aggregator_delivery" | "self_pickup",
  paymentStatus: "prepaid" | "cod",
  commission: 25,  // percentage
  estimatedDelivery: "35min"
}

Status push back to aggregator:
  Order accepted  → aggregator API: confirm(externalId)
  Order ready     → aggregator API: ready(externalId)
  Order picked up → aggregator API: picked_up(externalId)
```

### 4.3 WhatsApp Business API Templates

```
TEMPLATE 1: order_confirmation
"🎉 Order confirmed!
Order #{{order_number}} from {{restaurant_name}}
Items: {{items_summary}}
Total: {{currency}} {{total}}
{{delivery_or_pickup}}: {{eta}}
Track: {{tracking_url}}"

TEMPLATE 2: order_ready
"✅ Your order #{{order_number}} is ready!
{{pickup_message_or_rider_assigned}}"

TEMPLATE 3: delivery_update
"🛵 Your rider {{rider_name}} is on the way!
ETA: {{eta}} minutes
Track live: {{tracking_url}}"

TEMPLATE 4: khata_reminder
"📒 Hi {{customer_name}}, you have a pending balance of {{currency}} {{balance}} at {{restaurant_name}}.
Last transaction: {{last_date}}
Pay via: {{payment_link}}
Thank you! 🙏"

TEMPLATE 5: birthday_offer
"🎂 Happy Birthday {{customer_name}}!
{{restaurant_name}} has a special gift for you:
{{offer_details}}
Valid today only. Show this message! 🎁"

TEMPLATE 6: win_back
"👋 We miss you, {{customer_name}}!
It's been {{days}} days since your last visit.
Here's {{discount}}% off your next order:
Code: {{coupon_code}}
Order now: {{order_url}}"

TEMPLATE 7: loyalty_update
"🌟 {{customer_name}}, you earned {{points}} points!
Balance: {{total_points}} points
Tier: {{tier}} ({{next_tier}} in {{points_needed}} more points)
Redeem rewards: {{rewards_url}}"

TEMPLATE 8: feedback_request
"Hi {{customer_name}}, thank you for dining at {{restaurant_name}}!
How was your experience? Rate us:
⭐ {{feedback_url}}
Your feedback helps us serve you better! 🙏"

TEMPLATE 9: reservation_confirm
"📅 Reservation confirmed!
{{restaurant_name}}
Date: {{date}} at {{time}}
Party: {{party_size}} guests
Table: {{table_name}}
Need to change? Reply CANCEL or call {{phone}}"

TEMPLATE 10: marketing_promo
"🔥 {{restaurant_name}} Special!
{{promo_title}}
{{promo_details}}
Valid: {{valid_dates}}
Order: {{order_url}}
Reply STOP to unsubscribe"

BOT STATE MACHINE:
  idle → greeting → awaiting_choice
  awaiting_choice → ordering | tracking | reservation | human_handoff
  ordering → menu_browsing → cart → address → payment → confirmed
  tracking → show_status → idle
  reservation → date_time → party_size → confirmed
```

### 4.4 Tax Authority Integration

```typescript
// packages/shared/src/tax/types.ts

interface TaxProvider {
  country: string;
  name: string;

  calculateTax(params: {
    subtotal: number;
    items: Array<{ category: string; amount: number }>;
    serviceCharge: number;
  }): TaxBreakdown;

  formatInvoice(bill: Bill): InvoiceData;
  validateTaxId(id: string): boolean;
}

// NEPAL IRD:
// - VAT: 13% on all food & beverages
// - PAN (Permanent Account Number) required
// - IRD e-billing API for real-time invoice submission
// - Fiscal year: Shrawan 1 to Ashadh 30 (mid-July to mid-July)
// - Invoice format: must include PAN, invoice number, date, VAT amount

// INDIA GST:
// - GST slabs: 5% (non-AC, <Rs 7500 turnover), 18% (AC restaurants)
// - GSTIN (15-digit) required
// - HSN codes for food items
// - Monthly filing: GSTR-1 (sales), GSTR-3B (summary)
// - E-invoicing mandatory for turnover > Rs 5 crore

// BANGLADESH VAT:
// - VAT: 5% on restaurant services (simplified)
// - BIN (Business Identification Number) required
// - Monthly VAT return filing

// Implementation: Country-specific adapter selected on restaurant.country
```

---

*End of Infrastructure, Security & AI Architecture*
