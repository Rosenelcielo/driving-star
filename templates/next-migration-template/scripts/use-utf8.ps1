# Switch the current PowerShell session to UTF-8 so Chinese source files render correctly.
chcp 65001 | Out-Null
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()

Write-Output "PowerShell UTF-8 mode enabled for this session."
