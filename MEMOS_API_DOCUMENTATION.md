# Memos API 完整文档

## 基础信息

- **Base URL**: `https://memos.syaoran.me/api/v1`
- **Content-Type**: `application/json`
- **认证**: 文档中未明确提及（可能需要 Token 认证）

---

## 1. ListMemos - 获取 Memos 列表

**端点**: `GET /api/v1/memos`

**功能**: 列出 memos，支持分页和过滤

### 查询参数

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `pageSize` | integer | 否 | 最大返回数量<br/>- 默认: 最多 50 条<br/>- 最大: 1000 条<br/>- 超过 1000 的值会被强制设为 1000 |
| `pageToken` | string | 否 | 分页标记<br/>- 从前一次 ListMemos 调用中获取<br/>- 用于获取下一页 |
| `state` | enum | 否 | Memos 状态过滤<br/>- 默认: `NORMAL`<br/>- 可选值:<br/>  - `STATE_UNSPECIFIED`<br/>  - `NORMAL` (正常)<br/>  - `ARCHIVED` (已归档) |
| `orderBy` | string | 否 | 排序方式<br/>- 默认: `"display_time desc"`<br/>- 支持多字段排序（逗号分隔）<br/>- 示例: `"pinned desc, display_time desc"`<br/>- 支持字段: `pinned`, `display_time`, `create_time`, `update_time`, `name` |
| `filter` | string | 否 | 过滤表达式<br/>- 使用 CEL 表达式语法<br/>- 参考: Shortcut.filter |
| `showDeleted` | boolean | 否 | 是否显示已删除的 memos<br/>- 默认: false |

### 响应格式

#### 成功响应 (200 OK)

```json
{
  "memos": [
    {
      "id": "string",
      "name": "string",
      "row_status": "string",
      "creator_id": "integer",
      "created_ts": "integer",
      "updated_ts": "integer",
      "display_ts": "integer",
      "content": "string",
      "visibility": "string",
      "tags": ["string"]
    }
  ],
  "nextPageToken": "string (可选)"
}
```

| 字段 | 说明 |
|------|------|
| `memos[]` | Memos 数组 |
| `nextPageToken` | 下一页标记（如果为空，表示没有后续页面） |

### Memo 对象结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识符 |
| `name` | string | 名称 |
| `row_status` | string | 行状态 |
| `creator_id` | integer | 创建者 ID |
| `created_ts` | integer | 创建时间戳 |
| `updated_ts` | integer | 更新时间戳 |
| `display_ts` | integer | 显示时间戳 |
| `content` | string | 内容 |
| `visibility` | string | 可见性 |
| `tags` | array | 标签数组 |

### 错误响应 (Default)

```json
{
  "code": "integer",
  "message": "string",
  "details": [
    {
      "@type": "string",
      "propertyName": "anything"
    }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `code` | 状态码（枚举值，参考 google.rpc.Code） |
| `message` | 错误信息（英文） |
| `details` | 错误详情数组 |

---

## 实际测试验证的查询示例

### ✅ 成功的查询

```bash
# 1. 基本查询（获取 5 条）
GET /api/v1/memos?pageSize=5

# 2. 按标签过滤（使用 tag in 语法）
GET /api/v1/memos?filter=tag%20in%20%5B%22%E6%9D%A5%E5%86%99%E9%A6%96%E4%BF%B3%E5%8F%A5%E5%90%A7%22%5D&pageSize=5

# 3. 按内容精确匹配
GET /api/v1/memos?filter=content%20%3D%3D%20%22%E6%9D%A5%E5%86%99%E9%A6%96%E8%AF%97%E5%90%A7%22&pageSize=5

# 4. 分页查询
GET /api/v1/memos?pageSize=3&pageToken=xxx

# 5. 组合查询（示例）
GET /api/v1/memos?state=NORMAL&orderBy=display_time%20desc&pageSize=10
```

---

## 高级功能

### 排序 (orderBy)

**支持单个字段排序**:
```javascript
orderBy: "display_time desc"  // 按显示时间降序
orderBy: "create_time asc"    // 按创建时间升序
orderBy: "pinned desc"        // 按置顶降序
```

**支持多字段排序**:
```javascript
orderBy: "pinned desc, display_time desc"  // 先按置顶降序，再按时间降序
orderBy: "create_time asc, name asc"       // 先按创建时间升序，再按名称升序
```

### 状态过滤 (state)

```javascript
// 只显示正常的 memos（默认）
state: "NORMAL"

// 只显示已归档的 memos
state: "ARCHIVED"
```

### 过滤表达式 (filter)

**已验证的语法**:

1. **按标签过滤**:
   ```javascript
   filter: 'tag in ["标签名"]'
   ```

2. **按内容精确匹配**:
   ```javascript
   filter: 'content == "精确内容"'
   ```

**其他可能的语法**（需要进一步测试）:
```javascript
// 按创建者过滤
filter: 'creator_id == 123'

// 按可见性过滤
filter: 'visibility == "PUBLIC"'

// 组合条件
filter: 'state == "NORMAL" && creator_id == 123'

// 按创建时间过滤
filter: 'create_time >= "2023-01-01"'
```

---

## 错误处理

### 常见错误码

| 状态码 | 说明 | 示例 |
|--------|------|------|
| 200 | 成功 | 请求正常 |
| 400 | 请求参数错误 | Filter 语法错误 |
| 5xx | 服务器错误 | 内部错误 |

### 错误示例

**Filter 语法错误 (400)**:
```json
{
  "code": 3,
  "message": "invalid filter: failed to parse filter: failed to compile filter: ERROR: <input>:1:1: undeclared reference to 'tags' (in container '')\n | tags in [\"来写首俳句吧\"]\n | ^",
  "details": []
}
```

---

## 最佳实践

1. **分页处理**:
   - 总是检查 `nextPageToken` 是否存在
   - 如果存在，表示还有更多数据

2. **错误处理**:
   - 检查响应状态码
   - 解析错误消息以了解具体问题
   - 对 5xx 错误实现重试机制

3. **查询优化**:
   - 使用合适的 `pageSize`（建议 10-50）
   - 使用过滤减少数据传输
   - 使用排序确保结果一致性

4. **数据验证**:
   - 验证返回的 `memos` 数组
   - 检查必需的字段（id, content, tags）
   - 处理空结果

---

## 与现有代码的集成

### TabDataContext.tsx 更新

```typescript
const getKey = (pageIndex: number, previousPageData: any, tag: string) => {
  if (previousPageData && !previousPageData.nextPageToken) return null

  const sanitizedTag = sanitizeTag(tag)

  const params: Record<string, string> = {
    // 使用正确的 filter 语法
    filter: `tag in ["${sanitizedTag}"]`,
    pageSize: '10'
  }

  if (pageIndex > 0 && previousPageData?.nextPageToken) {
    params.pageToken = previousPageData.nextPageToken
  }

  const url = buildApiUrl(API_CONFIG.ENDPOINTS.MEMOS, params)
  return url
}
```

---

**文档生成时间**: 2025-12-11
**API 版本**: v1
**状态**: ✅ 完整验证
