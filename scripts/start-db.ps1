# Starts the portable MySQL 8.4 instance used for local development.
#
# The server is deliberately installed outside the repository so its data
# directory is never watched by Vite nor picked up by git. It is not registered
# as a Windows service, so it needs starting again after a reboot. Running this
# script repeatedly is safe - it returns immediately if the server is already up.
$ErrorActionPreference = "Stop"

$root = if ($env:LASER_PARTS_DB_HOME) { $env:LASER_PARTS_DB_HOME } else { Join-Path $HOME ".laser-parts-db" }
$mysqld = Join-Path $root "mysql-8.4.0-winx64\bin\mysqld.exe"
$config = Join-Path $root "my.ini"
$port = 3307

if (-not (Test-Path $mysqld)) {
  Write-Error "Nie znaleziono MySQL w $root. Ustaw LASER_PARTS_DB_HOME albo rozpakuj tam mysql-8.4.0-winx64."
}

if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
  Write-Host "MySQL juz nasluchuje na porcie $port."
  exit 0
}

Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=`"$config`"" -WindowStyle Hidden

for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Milliseconds 500
  if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
    Write-Host "MySQL wystartowal na porcie $port."
    exit 0
  }
}

Write-Error "MySQL nie wystartowal w ciagu 15 s. Sprawdz $root\data\*.err."
