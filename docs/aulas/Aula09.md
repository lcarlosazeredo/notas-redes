# Aula 09 — 09/09/2026

# Camada de Aplicação — HTTP

Na camada de aplicação, alguns protocolos importantes são:

- HTTP;
- protocolos de e-mail;
- DNS.

Nesta aula, o foco é o **HTTP**.

---

# HTTP — Hypertext Transfer Protocol

O **HTTP (Hypertext Transfer Protocol)** é o protocolo da camada de aplicação utilizado para a comunicação entre clientes e servidores Web.

Em uma interação típica:

- o **cliente**, normalmente um navegador, envia uma requisição;
- o **servidor Web** recebe essa requisição e envia uma resposta.

De maneira simplificada:

\[
\text{Cliente}
\xrightarrow{\text{HTTP Request}}
\text{Servidor}
\]

\[
\text{Cliente}
\xleftarrow{\text{HTTP Response}}
\text{Servidor}.
\]

---

## Métodos HTTP

Uma requisição HTTP contém um **método**, que indica a operação desejada sobre determinado recurso.

### GET

O método `GET` é utilizado para solicitar um recurso.

Por exemplo:

```http
GET /index.html
```

ou:

```http
GET /img1.png
```

### HEAD

O método `HEAD` é semelhante ao `GET`, mas solicita apenas os cabeçalhos da resposta, sem o corpo do objeto.

Pode ser utilizado, por exemplo, para obter informações sobre um recurso sem transferi-lo integralmente.

### POST

O método `POST` permite enviar dados ao servidor para serem processados.

### PUT

O método `PUT` é utilizado para criar ou substituir o conteúdo associado a determinado recurso.

### DELETE

O método `DELETE` solicita a remoção de determinado recurso.

### PATCH

O método `PATCH` permite realizar uma modificação parcial em um recurso.

> **Observação:** nas anotações também aparece `MERGE`. Esse não é um dos métodos básicos padronizados do HTTP. Ele pode aparecer em extensões específicas, portanto não foi incluído aqui como um método HTTP básico.

---

# Evolução do HTTP

As diferentes versões do HTTP buscaram melhorar principalmente o desempenho da transferência de vários objetos pela Web.

Uma página Web normalmente não é constituída apenas pelo arquivo HTML.

Por exemplo:

\[
\text{HTML}
+
\text{imagem}_1
+
\text{imagem}_2
+
\cdots
\]

O cliente pode primeiro solicitar o HTML e, ao interpretar esse arquivo, descobrir que também precisa solicitar outros objetos.

---

## HTTP/1.x

No HTTP/1.x, as requisições são transportadas tradicionalmente sobre **TCP**.

\[
\text{HTTP}
\longrightarrow
\text{TCP}.
\]

Em um modelo sequencial, podemos ter:

\[
GET(\text{HTML})
\rightarrow
\text{resposta}
\]

seguido de:

\[
GET(\text{img}_1)
\rightarrow
\text{resposta}
\]

e depois:

\[
GET(\text{img}_2)
\rightarrow
\text{resposta}.
\]

Uma dificuldade é que a espera por uma resposta pode impedir o avanço das respostas seguintes.

---

## HTTP/2

O **HTTP/2** foi projetado para melhorar o desempenho permitindo **multiplexação/interleaving** de diferentes objetos dentro de uma mesma conexão.

Em vez de tratar toda a resposta de um objeto antes de avançar para outro, os dados podem ser divididos em partes e intercalados.

Por exemplo:

\[
\text{objeto 1}
\rightarrow
\text{objeto 2}
\rightarrow
\text{objeto 1}
\rightarrow
\text{objeto 3}
\rightarrow
\cdots
\]

Isso permite inclusive atribuir diferentes prioridades aos objetos.

### Multiplexação

O HTTP/2 pode manter vários **streams** lógicos na mesma conexão TCP.

Assim:

\[
\boxed{
\text{vários streams HTTP}
\longrightarrow
\text{uma conexão TCP}
}
\]

Esse mecanismo permite melhorar a utilização da conexão.

### Limitação relacionada ao TCP

Apesar de o HTTP/2 permitir multiplexação no nível HTTP, os dados continuam sendo transportados por uma única conexão TCP.

O TCP fornece um fluxo de bytes ordenado.

Portanto, se ocorre perda de dados no TCP, os dados posteriores precisam aguardar a recuperação da parte perdida.

Isso pode produzir **Head-of-Line Blocking (HOL Blocking)** no nível de transporte:

\[
\text{perda em um ponto do fluxo TCP}
\Rightarrow
\text{outros dados posteriores também aguardam}.
\]

Assim, a multiplexação do HTTP/2 resolve problemas no nível HTTP, mas ainda está sujeita ao comportamento do TCP.

---

## HTTP/3

O **HTTP/3** modifica essa arquitetura utilizando **QUIC**.

\[
\boxed{
\text{HTTP/3}
\longrightarrow
\text{QUIC}
\longrightarrow
\text{UDP}
}
\]

O QUIC implementa mecanismos que tradicionalmente seriam associados ao transporte, mas utiliza UDP como base.

Uma vantagem importante é que seus streams podem ser tratados de maneira independente.

Assim, a perda de dados em um stream não precisa bloquear os demais streams da mesma forma que ocorre quando todos dependem de um único fluxo ordenado do TCP.

O QUIC também possui mecanismos de segurança integrados ao estabelecimento da conexão, utilizando TLS.

---

# HTTP não persistente

No **HTTP não persistente**, cada conexão TCP é utilizada para transferir um objeto e depois é encerrada.

Por exemplo, para uma página contendo:

- `index.html`;
- `img1`;
- `img2`;

podemos ter:

\[
\text{TCP}_1
\rightarrow
GET(\text{HTML})
\]

\[
\text{TCP}_2
\rightarrow
GET(\text{img}_1)
\]

\[
\text{TCP}_3
\rightarrow
GET(\text{img}_2).
\]

Cada objeto pode, portanto, exigir uma nova conexão.

---

## Custo de estabelecer uma conexão

Antes de utilizar TCP para transportar a requisição HTTP, é necessário estabelecer a conexão TCP.

De forma simplificada:

1. estabelecimento da conexão TCP;
2. envio da requisição HTTP;
3. recebimento da resposta;
4. encerramento da conexão.

Considerando apenas RTTs e ignorando o tempo de transmissão do objeto, uma conexão não persistente exige aproximadamente:

\[
1\,RTT
\]

para estabelecer o TCP e mais:

\[
1\,RTT
\]

para enviar a requisição e começar a receber a resposta.

Assim:

\[
\boxed{
\text{aproximadamente }2\,RTT+\text{tempo de transmissão do objeto}
}
\]

por conexão.

---

## Conexões TCP paralelas

Uma maneira de melhorar o desempenho do HTTP não persistente é abrir várias conexões TCP simultaneamente.

Por exemplo:

\[
\text{TCP}_1
\rightarrow
\text{img}_1
\]

\[
\text{TCP}_2
\rightarrow
\text{img}_2
\]

\[
\text{TCP}_3
\rightarrow
\text{img}_3.
\]

Dessa forma, vários objetos podem ser transferidos em paralelo.

Entretanto, isso exige a criação de várias conexões TCP.

> **[Inserir figura]** Diagramas feitos em sala mostrando conexões TCP paralelas para buscar diferentes imagens.

---

# HTTP persistente

No **HTTP persistente**, a conexão TCP permanece aberta e pode ser reutilizada para várias requisições e respostas.

Assim:

\[
\text{TCP}
\rightarrow
\begin{cases}
GET(\text{HTML})\\
GET(\text{img}_1)\\
GET(\text{img}_2)\\
\vdots
\end{cases}
\]

Não é necessário estabelecer uma nova conexão TCP para cada objeto.

Isso reduz o custo de criação repetida de conexões.

---

## Reutilização da conexão

Uma sequência pode ser:

```text
abre conexão TCP
    ↓
GET HTML
    ↓
resposta HTML
    ↓
GET img1
    ↓
resposta img1
    ↓
GET img2
    ↓
resposta img2
    ↓
...
```

A mesma conexão pode permanecer disponível para novas requisições.

---

## Persistência e paralelismo

Os conceitos de **persistência** e **paralelismo** são diferentes.

Uma conexão pode ser persistente e ainda assim o navegador utilizar mais de uma conexão TCP em paralelo.

Portanto:

- **persistência**: reutilização de uma conexão;
- **paralelismo**: existência de várias transferências/conexões ocorrendo simultaneamente.

> **[Inserir figura]** Diagramas feitos em sala comparando HTTP não persistente, conexões TCP paralelas e HTTP persistente.

---

# HTTP e segurança

HTTP puro não fornece, sozinho, mecanismos de:

- confidencialidade;
- integridade criptográfica;
- autenticação da outra extremidade.

Para isso, utiliza-se **TLS (Transport Layer Security)**.

---

## HTTPS

O **HTTPS** corresponde ao uso de HTTP com proteção TLS.

Para HTTP/1.1 e HTTP/2, podemos representar:

\[
\boxed{
\text{HTTP}
\longrightarrow
\text{TLS}
\longrightarrow
\text{TCP}
}
\]

O TLS acrescenta mecanismos como:

- **confidencialidade**;
- **integridade das mensagens**;
- **autenticação**, normalmente ao menos do servidor.

> **Observação:** disponibilidade também é um objetivo importante de segurança, mas não é algo garantido pelo HTTPS/TLS. TLS está relacionado principalmente à confidencialidade, integridade e autenticação da comunicação.

---

## TLS e HTTP/3

No HTTP/3:

\[
\text{HTTP/3}
\longrightarrow
\text{QUIC}
\longrightarrow
\text{UDP}.
\]

O QUIC integra o estabelecimento da segurança TLS ao próprio processo de criação da conexão.

---

# HTTP é Stateless

Uma característica fundamental do HTTP é que ele é um protocolo **stateless**.

Isso vale independentemente de a conexão utilizada ser:

- persistente;
- não persistente;
- sequencial;
- paralela.

Também não depende da versão do HTTP.

---

## O que significa Stateless?

Por padrão, uma requisição HTTP é tratada de forma independente das requisições anteriores.

Em outras palavras:

\[
\boxed{
\text{a resposta à requisição atual não depende automaticamente do histórico das requisições anteriores}
}
\]

Por exemplo:

```text
GET /pagina1
GET /pagina2
GET /pagina3
```

O protocolo HTTP, por si só, não exige que o servidor mantenha um histórico da sequência realizada por aquele usuário.

Isso simplifica a implementação e aumenta a escalabilidade do serviço.

---

# TCP é Stateful

É importante não confundir o estado da conexão de transporte com o estado da aplicação HTTP.

O **TCP é stateful**.

Durante uma conexão, o TCP mantém informações como:

- estado da conexão;
- números de sequência;
- acknowledgments;
- buffers;
- temporizadores.

Portanto:

\[
\boxed{
\text{HTTP é stateless}
}
\]

enquanto:

\[
\boxed{
\text{TCP é stateful}.
}
\]

Uma conexão HTTP persistente sobre TCP não transforma o HTTP em um protocolo stateful.

---

# Cookies

Embora o HTTP seja stateless, muitas aplicações Web precisam manter algum tipo de estado entre requisições.

Exemplos:

- identificar um usuário;
- manter uma sessão autenticada;
- manter um carrinho de compras;
- lembrar preferências.

Para isso, pode-se utilizar **cookies**.

---

## Ideia do Cookie

O cookie permite associar várias requisições HTTP ao mesmo contexto de aplicação.

Uma interação simplificada pode ocorrer assim:

### Primeira resposta

O servidor envia:

```http
Set-Cookie: id=12345
```

O navegador armazena esse cookie.

### Requisições posteriores

O navegador envia:

```http
Cookie: id=12345
```

O servidor pode utilizar o identificador para consultar informações associadas àquele usuário ou sessão.

Assim:

\[
\text{HTTP stateless}
+
\text{cookie}
+
\text{estado mantido pela aplicação}
\]

permite construir uma experiência que aparenta possuir estado entre requisições.

> **Importante:** o cookie não transforma o protocolo HTTP em stateful. O HTTP continua stateless; o estado é implementado por mecanismos adicionais da aplicação.

---

# Cache Web

Outro componente importante de HTTP é a **cache**.

Uma cache armazena temporariamente cópias de objetos obtidos anteriormente.

Quando um cliente solicita um objeto, a cache verifica se possui uma cópia válida.

---

## Três entidades

Podemos representar:

\[
\text{Cliente}
\longleftrightarrow
\text{Cache}
\longleftrightarrow
\text{Servidor de origem}.
\]

Nesse cenário, a cache desempenha dois papéis:

- para o cliente, comporta-se como um **servidor**;
- para o servidor de origem, comporta-se como um **cliente**.

---

## Cache Hit

Se o objeto solicitado já está armazenado e ainda pode ser utilizado:

\[
\boxed{\text{Cache Hit}}
\]

a cache responde diretamente ao cliente.

Assim:

\[
\text{Cliente}
\longleftrightarrow
\text{Cache}.
\]

Não é necessário buscar novamente o objeto no servidor de origem.

---

## Cache Miss

Se o objeto não está disponível ou não é mais válido:

\[
\boxed{\text{Cache Miss}}
\]

a cache precisa consultar o servidor:

\[
\text{Cliente}
\rightarrow
\text{Cache}
\rightarrow
\text{Servidor}.
\]

A resposta pode então ser armazenada para requisições futuras.

---

## Vantagens da cache

O uso de cache pode:

- reduzir o tempo de resposta;
- reduzir tráfego no enlace de acesso;
- reduzir carga sobre o servidor de origem;
- permitir que vários clientes reutilizem uma mesma cópia.

Uma cache pode atender diversos clientes:

\[
\begin{array}{ccc}
\text{Cliente}_1 & \searrow & \\
\text{Cliente}_2 & \rightarrow & \text{Cache}
\rightarrow
\text{Servidor}\\
\text{Cliente}_3 & \nearrow &
\end{array}
\]

---

# Controle da validade da cache

Um objeto não pode necessariamente permanecer válido para sempre.

O HTTP possui cabeçalhos que ajudam a determinar durante quanto tempo uma resposta pode ser reutilizada.

Um exemplo é:

```http
Cache-Control: max-age=<segundos>
```

Por exemplo:

```http
Cache-Control: max-age=3600
```

indica que a resposta pode ser considerada fresca por:

\[
3600\text{ s}=1\text{ hora}.
\]

Esse mecanismo ajuda a controlar a **freshness** do objeto armazenado.

---

# Políticas de troca da cache

Quando a cache possui espaço limitado, pode ser necessário remover objetos para armazenar outros.

Foram citadas em aula políticas como:

- **FIFO** — *First In, First Out*;
- **LRU** — *Least Recently Used*.

## FIFO

Remove o objeto que está armazenado há mais tempo.

## LRU

Remove o objeto que não é utilizado há mais tempo.

---

## TTL

Também foi mencionado o **TTL (Time To Live)**.

O TTL representa uma duração associada à validade de uma informação.

Quando o TTL expira, aquela informação precisa ser considerada vencida ou revalidada, dependendo do mecanismo utilizado.

> **Observação:** TTL/`max-age` está relacionado principalmente à validade temporal do conteúdo, enquanto FIFO e LRU são políticas utilizadas para decidir qual objeto remover quando é necessário liberar espaço.

---

# Resumo

Os principais pontos desta aula são:

- métodos HTTP;
- evolução de HTTP/1.x para HTTP/2 e HTTP/3;
- HTTP/2 utiliza multiplexação sobre TCP;
- HTTP/3 utiliza QUIC sobre UDP;
- conexões HTTP podem ser persistentes ou não persistentes;
- conexões paralelas podem melhorar o tempo de obtenção de vários objetos;
- HTTPS utiliza mecanismos de segurança fornecidos por TLS;
- HTTP é stateless;
- TCP é stateful;
- cookies permitem que aplicações mantenham estado entre requisições;
- caches reduzem tráfego e atraso;
- `Cache-Control`, `max-age`, TTL, FIFO e LRU ajudam a administrar conteúdo armazenado.

