param(
  [string]$WorkbookPath = (Join-Path $HOME 'Downloads\Mercaconsciente MATRIZ FINAL DE OFERTA_SEP-OCT_2026_V.1P.xlsx'),
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\src\data\offers.json')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Read-WorkbookXml($Archive, [string]$EntryName) {
  $entry = $Archive.GetEntry($EntryName)
  if (-not $entry) { return $null }
  $reader = [System.IO.StreamReader]::new($entry.Open())
  try { return [xml]$reader.ReadToEnd() }
  finally { $reader.Dispose() }
}

function Get-CellValue($Cell, [string[]]$Strings) {
  $valueNode = $Cell.SelectSingleNode("*[local-name()='v']")
  $value = if ($valueNode) { $valueNode.InnerText } else { '' }
  if ($Cell.GetAttribute('t') -eq 's' -and $value -ne '') {
    return $Strings[[int]$value]
  }
  if ($Cell.GetAttribute('t') -eq 'inlineStr') { return $Cell.InnerText }
  return $value
}

function Get-Category([string]$Text) {
  if ($Text -match '(?i)pan |pan$|panader|pandebono|focaccia|gallet|torta|roscon|arepa') { return 'Panadería' }
  if ($Text -match '(?i)caf[eé]|infusi[oó]n|cerveza|bebida|kombucha|arom[aá]tica') { return 'Bebidas' }
  if ($Text -match '(?i)jab[oó]n|cosm[eé]tic|champ[uú]|crema|desodorante|shampoo|aseo') { return 'Cuidado personal y hogar' }
  if ($Text -match '(?i)fruta|verdura|hortaliza|huevo|queso|leche|yogur|carne|pollo|miel') { return 'Frescos y lácteos' }
  return 'Despensa natural'
}

$archive = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $WorkbookPath))
try {
  $sharedXml = Read-WorkbookXml $archive 'xl/sharedStrings.xml'
  $sharedStrings = if ($sharedXml) {
    @($sharedXml.SelectNodes("//*[local-name()='si']") | ForEach-Object { $_.InnerText })
  } else { @() }

  $sheet = Read-WorkbookXml $archive 'xl/worksheets/sheet1.xml'
  $products = [System.Collections.Generic.List[object]]::new()

  foreach ($row in $sheet.SelectNodes("//*[local-name()='sheetData']/*[local-name()='row']")) {
    $fields = @{}
    foreach ($cell in $row.SelectNodes("*[local-name()='c']")) {
      $column = [regex]::Match($cell.GetAttribute('r'), '^[A-Z]+').Value
      if ($column -in @('A', 'B', 'C', 'D', 'E', 'F', 'G')) {
        $fields[$column] = Get-CellValue $cell $sharedStrings
      }
    }

    $rawDescription = [string]$fields['C']
    if ([string]::IsNullOrWhiteSpace($rawDescription) -or $rawDescription.Trim() -eq 'PRODUCTO') { continue }

    $description = [regex]::Replace($rawDescription, '\s+', ' ').Trim()
    $description = [regex]::Replace($description, '^(?i)\s*(PRODUCTO NUEVO\.|NUEVAMENTE DISPONIBLE\.?|DISPONIBLE\.)\s*', '')
    $name = [regex]::Replace($description, '(?i)\s*(\(|ingredientes\s*:).*$', '').Trim(' ', '.', '-', ':')
    if ([string]::IsNullOrWhiteSpace($name)) { $name = $description }

    $stockText = [string]$fields['G']
    if ([string]::IsNullOrWhiteSpace($stockText)) { $stockText = [string]$fields['E'] }
    $stock = $null
    $availability = 'unknown'
    if ($stockText -match '^\s*\d+(?:[.,]\d+)?\s*$') {
      $stock = [double]::Parse($stockText.Replace(',', '.'), [Globalization.CultureInfo]::InvariantCulture)
      $availability = if ($stock -gt 0) { 'limited' } else { 'unavailable' }
    } elseif ($stockText -match '(?i)stock\s+abierto') {
      $availability = 'open'
    }

    $price = $null
    if ([string]$fields['F'] -match '^\s*\d+(?:[.,]\d+)?\s*$') {
      $price = [double]::Parse(([string]$fields['F']).Replace(',', '.'), [Globalization.CultureInfo]::InvariantCulture)
    }

    $category = Get-Category ($name + ' ' + $description)
    $image = switch ($category) {
      'Panadería' { 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80' }
      'Bebidas' { 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80' }
      'Cuidado personal y hogar' { 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80' }
      'Frescos y lácteos' { 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80' }
      default { 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80' }
    }

    $products.Add([ordered]@{
      id = 'offer-' + $row.GetAttribute('r').PadLeft(3, '0')
      name = $name
      description = $description
      producer = ([string]$fields['A']).Trim()
      producerContact = ([string]$fields['B']).Trim()
      presentation = ([string]$fields['D']).Trim()
      price = $price
      stock = $stock
      availability = $availability
      category = $category
      image = $image
      sourceRow = [int]$row.GetAttribute('r')
      imageIsDemo = $true
      categoryIsDerived = $true
    })
  }

  $destination = [System.IO.Path]::GetFullPath($OutputPath)
  [System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($destination)) | Out-Null
  ConvertTo-Json -InputObject @($products) -Depth 5 | Set-Content -Path $destination -Encoding utf8
  Write-Output ("Exported {0} products to {1}" -f $products.Count, $destination)
}
finally {
  $archive.Dispose()
}