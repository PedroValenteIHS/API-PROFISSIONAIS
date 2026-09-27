# Testa o CRUD de Profissionais de ponta a ponta.
# Rode no PowerShell (clique direito na pasta > "Abrir no Terminal" ou abra o PowerShell e faça cd até a pasta).
# Comando: .\test-api.ps1
# Se der erro de permissão de execução, rode antes (uma vez só):
#   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

$baseUrl = "http://localhost:3000/profissionais"

function Print-Titulo($texto) {
    Write-Host ""
    Write-Host "==== $texto ====" -ForegroundColor Cyan
}

# 1) CREATE
Print-Titulo "1) POST - Criando profissional"
$novoProfissional = @{
    nome          = "Dr. Carlos Lima"
    crm           = "654321"
    crmUf         = "SP"
    especialidade = "Ortopedia"
} | ConvertTo-Json

try {
    $criado = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $novoProfissional -ContentType "application/json"
    $criado | ConvertTo-Json
    $id = $criado.id
    Write-Host "ID capturado para os próximos testes: $id" -ForegroundColor Green
} catch {
    Write-Host "Falhou ao criar. Detalhe:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit
}

# 2) LISTAR (com busca e paginação)
Print-Titulo "2) GET - Listando com busca"
try {
    $lista = Invoke-RestMethod -Uri "$baseUrl?busca=Carlos&pagina=1&limite=5" -Method Get
    $lista | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Falhou ao listar. Detalhe:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# 3) BUSCAR POR ID
Print-Titulo "3) GET /:id - Buscando o profissional criado"
try {
    $encontrado = Invoke-RestMethod -Uri "$baseUrl/$id" -Method Get
    $encontrado | ConvertTo-Json
} catch {
    Write-Host "Falhou ao buscar por id. Detalhe:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# 4) ATUALIZAR (PATCH)
Print-Titulo "4) PATCH /:id - Atualizando especialidade"
$atualizacao = @{ especialidade = "Neurologia" } | ConvertTo-Json
try {
    $atualizado = Invoke-RestMethod -Uri "$baseUrl/$id" -Method Patch -Body $atualizacao -ContentType "application/json"
    $atualizado | ConvertTo-Json
} catch {
    Write-Host "Falhou ao atualizar. Detalhe:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# 5) CRIAR DE NOVO COM MESMO CRM (deve dar 409 Conflict)
Print-Titulo "5) POST - Tentando criar CRM duplicado (deve dar erro 409)"
try {
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $novoProfissional -ContentType "application/json"
    Write-Host "ATENÇÃO: não deu erro! A validação de CRM duplicado pode não estar funcionando." -ForegroundColor Yellow
} catch {
    Write-Host "Deu erro como esperado:" -ForegroundColor Green
    Write-Host $_.Exception.Message
}

# 6) DELETAR
Print-Titulo "6) DELETE /:id - Removendo o profissional"
try {
    Invoke-RestMethod -Uri "$baseUrl/$id" -Method Delete
    Write-Host "Removido com sucesso." -ForegroundColor Green
} catch {
    Write-Host "Falhou ao deletar. Detalhe:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# 7) CONFIRMAR QUE SUMIU (deve dar 404)
Print-Titulo "7) GET /:id - Confirmando remoção (deve dar erro 404)"
try {
    Invoke-RestMethod -Uri "$baseUrl/$id" -Method Get
    Write-Host "ATENÇÃO: ainda encontrou o registro! O delete pode não ter funcionado." -ForegroundColor Yellow
} catch {
    Write-Host "Deu 404 como esperado (profissional não existe mais)." -ForegroundColor Green
}

Print-Titulo "Fim dos testes"
