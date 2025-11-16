# Requires: PowerShell 5+
# Usage:
#   1) حدّد عنوان الـ API والتوكن أدناه
#   2) شغّل:  pwsh ./sam-company/scripts/seed-announcements.ps1

$ErrorActionPreference = 'Stop'

# إعدادات الاتصال
$BASE = $env:VITE_API_BASE_URL
if (-not $BASE -or $BASE -eq '') {
  # عدّل العنوان هنا إذا لم تستخدم المتغير البيئي
  $BASE = 'http://127.0.0.1:8000'
}

$TOKEN = $env:ADMIN_TOKEN
if (-not $TOKEN -or $TOKEN -eq '') {
  # ضع توكن الأدمن هنا إذا لم تستخدم المتغير البيئي
  $TOKEN = '<PUT_ADMIN_TOKEN_HERE>'
}

$headers = @{ 
  'Authorization' = "Bearer $TOKEN"
  'Content-Type'  = 'application/json'
}

# بيانات وهمية: عدّل كما تريد
$today = Get-Date -Format 'yyyy-MM-dd'
$announcements = @(
  @{ text = 'عرض تجريبي اليوم فقط! إنترنت أسرع بسعر أقل'; cta = 'اشترك الآن'; language = 'ar'; is_active = $true;  date = $today },
  @{ text = 'Limited time: Fiber promo!';                  cta = 'Subscribe';   language = 'en'; is_active = $false; date = $today },
  @{ text = 'ترقية مجانية للسرعة لمدة شهر';                 cta = 'اعرف المزيد'; language = 'ar'; is_active = $false; date = $today }
)

Write-Host "Seeding announcements to $BASE ..." -ForegroundColor Cyan

foreach ($a in $announcements) {
  $body = $a | ConvertTo-Json -Depth 5
  try {
    $res = Invoke-RestMethod -Method Post -Uri "$BASE/api/admin/announcements" -Headers $headers -Body $body
    Write-Host "Created: $($a.text)" -ForegroundColor Green
  } catch {
    Write-Warning "Failed to create: $($a.text) — $($_.Exception.Message)"
  }
}

# تحقق من الإعلان النشط الذي سيظهر في الشريط
try {
  $active = Invoke-RestMethod -Method Get -Uri "$BASE/api/announcements/active" -Headers @{ 'Accept' = 'application/json' }
  Write-Host "Active announcement:" -ForegroundColor Yellow
  $active | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Warning "Failed to fetch active announcement — $($_.Exception.Message)"
}

Write-Host 'Done.' -ForegroundColor Cyan








