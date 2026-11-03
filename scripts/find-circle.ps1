Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\khana\.gemini\antigravity\brain\e1bae6ed-e3a7-49df-8d61-9a72cb2b7950\.user_uploaded\media_1793733524523_7c057da3.jpg"
$bmp = New-Object System.Drawing.Bitmap($sourcePath)

$w = $bmp.Width
$h = $bmp.Height

# We know the circle is centered horizontally (around X = 236) and in middle Y (between 300 and 700)
$minX = $w
$maxX = 0
$minY = $h
$maxY = 0

for ($y = 250; $y -lt 750; $y++) {
    for ($x = 30; $x -lt ($w - 30); $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Filtered Circle bounds: X: $minX to $maxX, Y: $minY to $maxY"
$cw = $maxX - $minX
$ch = $maxY - $minY
Write-Host "Width: $cw, Height: $ch"
$centerX = [math]::Round(($minX + $maxX) / 2)
$centerY = [math]::Round(($minY + $maxY) / 2)
$radius = [math]::Round([math]::Max($cw, $ch) / 2)
Write-Host "Center: ($centerX, $centerY), Radius: $radius"

$bmp.Dispose()
