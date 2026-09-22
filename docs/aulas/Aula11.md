# Aula 11 — 16/09/2026

## DNS — Resolução recursiva e iterativa

A aula começou retomando a diferença entre **resolução recursiva** e **resolução iterativa** no DNS.

### Resolução recursiva

Na resolução recursiva, quem recebe a consulta assume a responsabilidade de obter a resposta final.

Do ponto de vista de quem fez a consulta, há a vantagem de realizar apenas uma requisição e aguardar a resposta final.

Uma representação simplificada é:

\[
\text{Cliente}
\longrightarrow
\text{Servidor DNS}
\longrightarrow
\cdots
\longrightarrow
\text{Resposta final}.
\]

Uma consequência importante é que o servidor que iniciou a consulta pode ter menos oportunidade de observar as respostas intermediárias da hierarquia DNS e, portanto, de **popular sua cache** com essas informações.

### Resolução iterativa

Na resolução iterativa, cada servidor consultado pode responder indicando qual servidor deve ser consultado em seguida.

Por exemplo:

\[
\text{DNS local}
\rightarrow
\text{Root}
\rightarrow
\text{TLD}
\rightarrow
\text{Autoritativo}.
\]

O DNS local participa de cada etapa da busca.

Isso implica mais requisições, porém permite que ele observe as respostas intermediárias e armazene informações úteis em sua cache.

Assim, uma consulta futura semelhante pode ser respondida mais rapidamente.

> **Resumo:** a abordagem iterativa produz mais trocas durante a resolução, mas favorece o preenchimento da cache do resolvedor local.

---

## Resource Records do DNS

Os registros armazenados no DNS são chamados de **Resource Records (RRs)**.

Um RR possui a forma:

\[
\boxed{
(\text{Name},\text{Value},\text{Type},\text{TTL})
}
\]

onde:

- `Name`: nome associado ao registro;
- `Value`: valor do registro;
- `Type`: tipo do registro;
- `TTL`: *Time To Live*, indicando por quanto tempo o registro pode permanecer em cache.

### Registro A

Um registro do tipo `A` associa um hostname a um endereço IPv4:

\[
\text{hostname}
\longrightarrow
\text{IPv4}.
\]

Um endereço IPv4 possui:

\[
32\text{ bits}.
\]

### Registro AAAA

Um registro do tipo `AAAA` associa um hostname a um endereço IPv6:

\[
\text{hostname}
\longrightarrow
\text{IPv6}.
\]

Um endereço IPv6 possui:

\[
128\text{ bits}.
\]

---

## HTTP e DNS são stateless

Foi retomado um conceito da aula anterior:

\[
\boxed{
\text{HTTP e DNS são protocolos stateless}.
}
\]

Isso significa que uma mensagem do protocolo não depende, por definição, de um estado de sessão mantido a partir das mensagens anteriores.

No caso de HTTP, mecanismos como cookies podem ser utilizados pela aplicação para manter estado sem tornar o protocolo HTTP stateful.

No caso de DNS, cada consulta pode ser tratada como uma operação independente, embora os servidores possam manter **cache** para melhorar o desempenho.

---

## Arquiteturas de aplicação — Client-Server e P2P

Até este ponto, vários protocolos estudados utilizam fortemente a arquitetura **client-server**.

Outra possibilidade é a arquitetura **P2P — Peer-to-Peer**.

### Peer-to-Peer

Em uma arquitetura P2P, os dispositivos participantes são chamados de **peers**.

Cada peer pode atuar tanto como:

- cliente;
- servidor.

Assim, um peer que recebe dados também pode redistribuí-los para outros peers.

Isso permite que a capacidade total de distribuição aumente à medida que novos participantes entram no sistema.

Uma vantagem importante é:

\[
\boxed{
\text{maior escalabilidade com o número de peers}.
}
\]

Em uma arquitetura P2P totalmente distribuída, há menor dependência de um servidor central permanente.

Um exemplo importante é o **BitTorrent**.

---

## Distribuição de arquivos — Client-Server

Considere:

- $F$: tamanho do arquivo;
- $N$: número de clientes;
- $u_s$: taxa de upload do servidor;
- $d_i$: taxa de download do cliente $i$;
- $d_{\min}$: menor taxa de download entre os clientes.

No modelo client-server, o servidor precisa enviar uma cópia completa do arquivo para cada um dos $N$ clientes.

Portanto, precisa transmitir ao todo:

\[
NF
\]

bits.

Como sua taxa de upload é $u_s$, temos o limite:

\[
D_{CS}\geq\frac{NF}{u_s}.
\]

Além disso, o cliente mais lento não pode receber o arquivo em menos de:

\[
\frac{F}{d_{\min}}.
\]

Assim:

\[
\boxed{
D_{CS}
\geq
\max
\left\{
\frac{NF}{u_s},
\frac{F}{d_{\min}}
\right\}.
}
\]

No caso em que $N$ cresce mantendo as demais grandezas fixas, o termo

\[
\frac{NF}{u_s}
\]

cresce linearmente com $N$.

Portanto, para $N$ grande:

\[
D_{CS}=O(N).
\]

---

## Distribuição de arquivos — P2P

No modelo P2P, os próprios peers ajudam a distribuir o arquivo.

Defina:

- $u_i$: capacidade de upload do peer $i$.

A capacidade total de upload disponível é:

\[
u_s+\sum_{i=1}^{N}u_i.
\]

Existem três limites importantes para o tempo de distribuição.

### 1. O servidor precisa colocar o arquivo inicialmente na rede

Como inicialmente apenas o servidor possui o arquivo:

\[
D_{P2P}\geq\frac{F}{u_s}.
\]

### 2. O peer mais lento precisa baixar o arquivo

\[
D_{P2P}\geq\frac{F}{d_{\min}}.
\]

### 3. É necessário entregar $NF$ bits ao conjunto dos peers

Como a capacidade total de upload é:

\[
u_s+\sum_{i=1}^{N}u_i,
\]

temos:

\[
D_{P2P}
\geq
\frac{NF}
{u_s+\sum_{i=1}^{N}u_i}.
\]

Portanto:

\[
\boxed{
D_{P2P}
\geq
\max
\left\{
\frac{F}{u_s},
\frac{F}{d_{\min}},
\frac{NF}{u_s+\sum_{i=1}^{N}u_i}
\right\}.
}
\]

A diferença fundamental é que, à medida que novos peers entram no sistema, eles também acrescentam capacidade de upload.

Se a capacidade média de upload dos peers permanecer aproximadamente constante, então:

\[
\sum_{i=1}^{N}u_i
\]

também cresce aproximadamente de forma linear com $N$.

Consequentemente, o termo

\[
\frac{NF}{u_s+\sum_i u_i}
\]

não precisa crescer linearmente com $N$.

Essa é a principal razão para a melhor escalabilidade do P2P em comparação com o modelo client-server.

---

## Missing Piece Syndrome

Um problema possível em sistemas P2P é o chamado **Missing Piece Syndrome**.

O arquivo é dividido em várias partes (*pieces* ou *chunks*).

Se determinada parte estiver disponível em pouquíssimos peers, ela pode se tornar um gargalo para completar a distribuição.

Imagine que todos os peers tenham quase todo o arquivo, mas todos estejam esperando a mesma parte rara:

```text
Peer 1: [✓][✓][✓][ ]
Peer 2: [✓][✓][✓][ ]
Peer 3: [✓][✓][✓][ ]
Peer 4: [✓][✓][✓][ ]
                    ↑
                peça rara
```

Quando um peer termina de receber o arquivo e abandona o sistema imediatamente, a disponibilidade de determinadas partes também pode diminuir.

Para combater esse problema, o BitTorrent utiliza estratégias de seleção de peças.

---

## BitTorrent — Rarest First

Uma estratégia utilizada pelo BitTorrent é **rarest first**.

A ideia é pedir primeiro as partes que possuem menos cópias disponíveis entre os vizinhos.

Assim, busca-se espalhar rapidamente as peças mais raras e evitar que elas se tornem o gargalo da distribuição.

---

## BitTorrent — Tit-for-Tat

Outro mecanismo importante é o **tit-for-tat**.

A ideia é favorecer peers que também contribuem com dados para o sistema.

Um peer tende a enviar dados para vizinhos que estão oferecendo boas taxas de upload para ele.

Isso cria um incentivo para que os usuários compartilhem dados em vez de apenas baixá-los.

De maneira simplificada:

\[
\boxed{
\text{quem contribui mais tende a receber mais}.
}
\]

Foi feita em aula a analogia do BitTorrent como uma espécie de **troca/negociação** entre os participantes.

---

## Observação — Modelos de filas

Durante a aula também foram retomados dois modelos de filas.

### M/M/1

No modelo $M/M/1$:

- chegadas com taxa $\lambda$;
- serviços com taxa $\mu$;
- um único servidor.

A cadeia de estados pode ser representada por:

\[
0
\xrightleftharpoons[\mu]{\lambda}
1
\xrightleftharpoons[\mu]{\lambda}
2
\xrightleftharpoons[\mu]{\lambda}
3
\cdots
\]

A intensidade de tráfego é:

\[
I=\frac{\lambda}{\mu}.
\]

Para estabilidade:

\[
I<1.
\]

O número médio de clientes no sistema é:

\[
\boxed{
\bar N=\frac{I}{1-I}.
}
\]

---

### M/M/$\infty$

No modelo $M/M/\infty$, existe um número ilimitado de servidores.

Uma chegada sempre pode iniciar imediatamente seu atendimento.

As transições de saída dependem de quantos clientes estão atualmente no sistema:

\[
0
\xrightleftharpoons[\mu]{\lambda}
1
\xrightleftharpoons[2\mu]{\lambda}
2
\xrightleftharpoons[3\mu]{\lambda}
3
\xrightleftharpoons[4\mu]{\lambda}
\cdots
\]

Como não há espera por falta de servidor, esse sistema é estável para qualquer valor finito de $\lambda$ e $\mu>0$.

O número médio de clientes é:

\[
\boxed{
\bar N=\frac{\lambda}{\mu}.
}
\]

O tempo médio no sistema é:

\[
\boxed{
\bar T=\frac{1}{\mu}.
}
\]

A distribuição estacionária do número de clientes é Poisson:

\[
\boxed{
P(N=n)
=
e^{-\lambda/\mu}
\frac{(\lambda/\mu)^n}{n!}.
}
\]

A probabilidade de o sistema estar não vazio é:

\[
P(N>0)
=
1-P(N=0)
=
1-e^{-\lambda/\mu}.
\]

> **Observação:** essa parte aparece como uma retomada lateral de teoria de filas nas anotações.

---

## Vídeo na Internet

Na parte final da aula, foram discutidos vídeos e streaming.

### CBR

**CBR — Constant Bit Rate** significa taxa de bits constante.

A taxa utilizada pelo vídeo permanece aproximadamente fixa ao longo do tempo.

### VBR

**VBR — Variable Bit Rate** significa taxa de bits variável.

A taxa pode aumentar ou diminuir conforme o conteúdo do vídeo.

Isso permite dedicar mais bits a trechos mais complexos e menos bits a trechos mais simples.

---

## Streaming

No **streaming**, não é necessário esperar o download completo do arquivo para começar a reproduzi-lo.

Enquanto partes posteriores ainda estão sendo recebidas, as partes que já chegaram podem ser reproduzidas.

Assim:

\[
\boxed{
\text{download e reprodução ocorrem simultaneamente}.
}
\]

---

## Buffer de reprodução

Antes de começar a reprodução, o cliente normalmente armazena uma quantidade inicial de dados em um **buffer**.

A ideia é escolher um atraso inicial suficiente para reduzir o risco de faltar conteúdo durante a reprodução.

Se o buffer esvaziar:

\[
\boxed{
\text{ocorre interrupção da reprodução}.
}
\]

Por outro lado, esperar dados demais antes de iniciar aumenta desnecessariamente o atraso inicial.

Existe, portanto, um compromisso entre:

- começar rapidamente;
- acumular dados suficientes para suportar variações da rede.

O comportamento pode ser melhorado ajustando:

- o tamanho do buffer;
- a codificação (*encoding*) e a taxa do vídeo.

---

## Programação com UDP e TCP — Sockets

A aula terminou entrando em **programação com sockets**, utilizando UDP e TCP.

Um **socket** funciona como uma interface utilizada pelo processo para enviar e receber dados através da rede.

A analogia utilizada é a de uma porta:

\[
\text{processo}
\longleftrightarrow
\boxed{\text{socket}}
\longleftrightarrow
\text{rede}.
\]

Trabalhar com um socket é semelhante a trabalhar com um objeto de entrada/saída, mas esse objeto representa comunicação através da rede.

---

## Operações bloqueantes

Algumas operações de entrada podem ser **bloqueantes**.

Isso significa que a execução fica esperando até que algum dado esteja disponível.

Exemplos incluem chamadas de recepção como:

```python
recv(...)
```

e, no caso de UDP:

```python
recvfrom(...)
```

Já uma chamada como:

```python
sendto(...)
```

envia um datagrama pela rede.

---

## UDP

UDP é **connectionless**.

Não há estabelecimento de uma conexão antes de começar a enviar datagramas.

No UDP, operações típicas são:

### Servidor

```text
socket()
   ↓
bind()
   ↓
recvfrom()
   ↓
sendto()
   ↓
close()
```

### Cliente

```text
socket()
   ↓
sendto()
   ↓
recvfrom()
   ↓
close()
```

Não são utilizados `listen()` e `accept()` para UDP.

---

## TCP

TCP é orientado à conexão.

Antes da troca de dados, uma conexão deve ser estabelecida.

### Servidor TCP

Uma sequência típica é:

```text
socket()
   ↓
bind()
   ↓
listen()
   ↓
accept()
   ↓
recv()
   ↓
send()
   ↓
close()
```

A chamada:

```python
bind(...)
```

associa o socket a um endereço local, normalmente definido por endereço IP e porta.

A chamada:

```python
listen(...)
```

coloca o socket do servidor em modo de espera por conexões.

A chamada:

```python
accept(...)
```

aceita uma conexão recebida e cria um socket associado àquele cliente.

`listen()` e `accept()` são operações associadas ao servidor TCP, não ao UDP.

---

### Cliente TCP

Uma sequência típica é:

```text
socket()
   ↓
connect()
   ↓
send()
   ↓
recv()
   ↓
close()
```

A chamada:

```python
connect(...)
```

inicia o estabelecimento da conexão com o servidor.

Depois disso, cliente e servidor podem trocar dados pelos sockets da conexão.

---

## Diferença geral entre UDP e TCP nos sockets

### UDP

- não estabelece conexão;
- utiliza datagramas;
- normalmente utiliza `sendto()` e `recvfrom()`;
- não utiliza `listen()` e `accept()`;
- o próprio UDP não realiza retransmissão para garantir entrega.

### TCP

- estabelece conexão;
- cria estado de conexão;
- oferece fluxo confiável de bytes;
- no servidor utiliza `listen()` e `accept()`;
- cliente utiliza `connect()`.

---

## Resumo

Os principais tópicos desta aula foram:

- resolução DNS recursiva e iterativa;
- uso da cache no DNS;
- Resource Records;
- registros `A` e `AAAA`;
- HTTP e DNS como protocolos stateless;
- arquitetura P2P;
- tempo de distribuição client-server;
- tempo de distribuição P2P;
- BitTorrent;
- *rarest first*;
- *tit-for-tat*;
- *Missing Piece Syndrome*;
- CBR e VBR;
- streaming e buffer de reprodução;
- programação com sockets;
- diferenças entre sockets UDP e TCP.

