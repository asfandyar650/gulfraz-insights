Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\khana\.gemini\antigravity\brain\e1bae6ed-e3a7-49df-8d61-9a72cb2b7950\.user_uploaded\media_1793733524523_7c057da3.jpg"
$bmp = New-Object System.Drawing.Bitmap($sourcePath)

$w = $bmp.Width
$h = $bmp.Height

Write-Host "Image size: $w x $h"

# Find bounds of white circle
# In the circle, pixels are white or black text, but near the perimeter they are white (R>200, G>200, B>200)
$minX = $w
$maxX = 0
$minY = $h
$maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        # Check if brightness is high (white circle background)
        if ($pixel.R -gt 220 -and $pixel.G -gt 220 -and $pixel.B -gt 220) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Circle bounds: X: $minX to $maxX, Y: $minY to $maxY"
$circleW = $maxX - $minX
$circleH = $maxY - $minY
Write-Host "Circle dimensions: Width: $circleW, Height: $circleH"

$bmp.Dispose()
