Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\khana\.gemini\antigravity\brain\e1bae6ed-e3a7-49df-8d61-9a72cb2b7950\.user_uploaded\media_1793733524523_7c057da3.jpg"
$bmp = New-Object System.Drawing.Bitmap($sourcePath)

$minX = 81
$minY = 357
$size = 310

# Create destination bitmap with 32-bit ARGB (transparent)
$destBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($destBmp)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Clear with transparent
$graphics.Clear([System.Drawing.Color]::Transparent)

# Create circular clip path
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(0, 0, $size, $size)
$graphics.SetClip($path)

# Draw the cropped region of source
$destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
$srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $size, $size)
$graphics.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$graphics.Dispose()
$bmp.Dispose()

# Save to destination paths
$targetDir1 = "C:\Users\khana\Desktop\gulfraz-insights\public\assets"
$targetDir2 = "C:\Users\khana\Desktop\gulfraz-insights\public\images"
$targetDir3 = "C:\Users\khana\Desktop\gulfraz-insights\public"

if (!(Test-Path $targetDir1)) { New-Item -ItemType Directory -Path $targetDir1 -Force }
if (!(Test-Path $targetDir2)) { New-Item -ItemType Directory -Path $targetDir2 -Force }

$destBmp.Save("$targetDir1\gulfraz-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$destBmp.Save("$targetDir2\gulfraz-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$destBmp.Save("$targetDir3\gulfraz-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$destBmp.Save("$targetDir3\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Successfully extracted and saved gulfraz-logo.png ($size x $size)"
$destBmp.Dispose()
