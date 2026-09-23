# Aula 12 — 18/09/2026

## Conteúdo da aula

Nesta aula foram trabalhados principalmente:

- uma retomada de **teoria de filas**;
- programação com **sockets TCP e UDP**;
- início do **Capítulo 3 — Camada de Transporte**;
- **multiplexação e demultiplexação**;
- características do **UDP**;
- **checksum**;
- introdução à ideia de **Reliable Data Transfer (RDT)**.

---

# Revisão — Teoria de Filas

## Notação

Considere um sistema de fila com:

- taxa de chegada:

\[
\lambda;
\]

- taxa de serviço:

\[
\mu;
\]

- utilização:

\[
\rho=\frac{\lambda}{\mu}.
\]

No contexto de uma fila de pacotes em um enlace, podemos escrever:

- taxa de chegada de pacotes:

\[
\lambda=a;
\]

- taxa de serviço:

\[
\mu=\frac{R}{L},
\]

onde:

- $R$ é a taxa do enlace em bits/s;
- $L$ é o tamanho médio dos pacotes em bits.

Assim:

\[
\rho
=
\frac{\lambda}{\mu}
=
\frac{a}{R/L}
=
\frac{aL}{R}.
\]

Nas anotações, a utilização também é indicada por $I$:

\[
\boxed{
I=\rho=\frac{aL}{R}.
}
\]

---

## Sistema em equilíbrio

Em equilíbrio, a taxa média de saída deve ser igual à taxa média de chegada.

Quando o servidor está ocupado, ele atende à taxa:

\[
\frac{R}{L}.
\]

Quando está ocioso, a taxa de serviço efetiva é zero.

Como o servidor está ocupado uma fração $I$ do tempo:

\[
a
=
\frac{R}{L}I
+
0(1-I).
\]

Logo:

\[
\boxed{
I=\frac{aL}{R}.
}
\]

---

# Tempo médio de espera

Considere:

- $\bar W$: tempo médio de espera na fila;
- $\bar N_q$: número médio de clientes/pacotes esperando;
- $\bar S$: tempo médio de serviço;
- $\bar S_R$: tempo residual médio de serviço;
- $\rho$: probabilidade de o servidor estar ocupado.

Uma chegada precisa esperar:

1. o atendimento dos pacotes que já estão na fila;
2. o tempo restante do pacote que está sendo atendido, caso o servidor esteja ocupado.

Usando a propriedade **PASTA** para chegadas Poisson, uma chegada observa, em média, o mesmo número de clientes que a média temporal do sistema.

Assim:

\[
\boxed{
\bar W
=
\bar N_q\bar S
+
\rho\bar S_R.
}
\]

Para um enlace:

\[
\bar S=\frac{L}{R}.
\]

Logo:

\[
\boxed{
\bar W
=
\bar N_q\frac{L}{R}
+
I\bar S_R.
}
\]

Pela Lei de Little aplicada à fila:

\[
\bar N_q=a\bar W.
\]

---

## Caso M/M/1

No modelo $M/M/1$, o tempo de serviço é exponencial.

Pela propriedade de falta de memória:

\[
\bar S_R=\bar S.
\]

Como:

\[
\bar S=\frac{L}{R},
\]

temos:

\[
\bar W
=
a\bar W\frac{L}{R}
+
I\frac{L}{R}.
\]

Como:

\[
a\frac{L}{R}=I,
\]

segue que:

\[
\bar W
=
I\bar W
+
I\frac{L}{R}.
\]

Portanto:

\[
(1-I)\bar W
=
I\frac{L}{R}.
\]

Assim:

\[
\boxed{
\bar W_{M/M/1}
=
\frac{I}{1-I}\frac{L}{R}.
}
\]

---

## Caso M/D/1

No modelo $M/D/1$, o tempo de serviço é determinístico.

Nesse caso, para uma chegada que encontra o servidor ocupado, o tempo residual médio é metade do tempo de serviço:

\[
\bar S_R
=
\frac{\bar S}{2}.
\]

Logo:

\[
\bar W
=
a\bar W\frac{L}{R}
+
I\frac{L}{2R}.
\]

Como:

\[
a\frac{L}{R}=I,
\]

temos:

\[
\bar W
=
I\bar W
+
I\frac{L}{2R}.
\]

Portanto:

\[
(1-I)\bar W
=
I\frac{L}{2R}.
\]

Assim:

\[
\boxed{
\bar W_{M/D/1}
=
\frac{I}{1-I}\frac{L}{2R}.
}
\]

Comparando:

\[
\boxed{
\bar W_{M/D/1}
=
\frac{1}{2}\bar W_{M/M/1}.
}
\]

para a mesma taxa de chegada, mesmo tempo médio de serviço e mesma utilização.

---

# Programação com Sockets

## TCP

TCP é:

- **orientado à conexão**;
- **confiável**;
- implementado pela pilha de protocolos do sistema operacional.

Antes de cliente e servidor trocarem dados, uma conexão TCP precisa ser estabelecida.

---

## Chamadas típicas — Servidor TCP

Uma sequência típica no servidor é:

```text
socket()
   ↓
bind()
   ↓
listen()
   ↓
accept()
   ↓
recv()/read()
   ↓
send()/write()
   ↓
close()
```

### `socket()`

Cria o socket.

### `bind()`

Associa o socket a um endereço local, normalmente:

\[
(\text{IP},\text{porta}).
\]

### `listen()`

Coloca o socket em modo de espera por conexões TCP.

### `accept()`

Espera uma nova conexão.

Quando uma conexão chega, `accept()` cria um novo socket associado especificamente àquele cliente.

### `recv()` / `read()`

Recebe dados da conexão.

### `send()` / `write()`

Envia dados pela conexão.

### `close()`

Encerra o socket.

---

## Chamadas típicas — Cliente TCP

No cliente:

```text
socket()
   ↓
connect()
   ↓
send()/write()
   ↓
recv()/read()
   ↓
close()
```

### `connect()`

O cliente solicita o estabelecimento da conexão TCP com o servidor.

Isso inicia o processo de estabelecimento da conexão, incluindo o handshake TCP.

---

## Chamadas locais × operações que envolvem a rede

Nem toda chamada de socket produz imediatamente mensagens na rede.

Por exemplo:

- `socket()` cria uma estrutura local no sistema operacional;
- `bind()` associa um endereço local;
- `listen()` coloca o socket em estado de escuta.

Já chamadas como:

- `connect()`;
- `send()`;
- `write()`;
- `close()`;

podem provocar ações efetivas do protocolo TCP na rede.

A chamada:

```text
accept()
```

aguarda até que uma conexão seja estabelecida.

---

## Chamadas bloqueantes

Uma chamada **bloqueante** pode suspender o processo até que o evento esperado ocorra.

Exemplos típicos:

```python
accept()
```

pode esperar até que algum cliente se conecte.

E:

```python
recv(...)
```

pode esperar até que dados estejam disponíveis.

Dependendo da configuração do socket, `connect()` e operações de envio também podem bloquear por algum período.

---

# TCP × UDP

## TCP

TCP oferece:

- orientação à conexão;
- transferência confiável;
- entrega ordenada;
- controle de fluxo;
- controle de congestionamento.

## UDP

UDP:

- não estabelece conexão;
- não garante entrega;
- não garante ordem;
- possui menor complexidade;
- fornece multiplexação/demultiplexação e detecção de erros por checksum.

Assim:

\[
\boxed{
\text{TCP: orientado à conexão e confiável}
}
\]

\[
\boxed{
\text{UDP: não orientado à conexão e não confiável}
}
\]

onde “não confiável” significa que o protocolo não garante que os dados chegarão corretamente ou sequer chegarão ao destino.

---

# Capítulo 3 — Camada de Transporte

A camada de transporte oferece comunicação lógica entre **processos** executando em hosts distintos.

A camada de rede entrega dados entre hosts:

\[
\boxed{
\text{host}
\longleftrightarrow
\text{host}
}
\]

enquanto a camada de transporte estende esse serviço para:

\[
\boxed{
\text{processo}
\longleftrightarrow
\text{processo}.
}
\]

---

## Host e processo

Um host é identificado na camada de rede por um endereço IP.

Um processo é identificado, para fins de comunicação de transporte, por um **número de porta** associado ao socket.

De forma simplificada:

\[
\boxed{
\text{IP identifica o host}
}
\]

e:

\[
\boxed{
\text{porta identifica o processo/socket}.
}
\]

---

# Funções importantes da camada de transporte

Nesta introdução ao Capítulo 3 foram destacadas funções como:

- multiplexação e demultiplexação;
- transferência confiável de dados;
- controle de fluxo;
- controle de congestionamento.

A sequência do capítulo estuda primeiro os princípios gerais e depois como o TCP implementa esses mecanismos.

---

# Multiplexação e Demultiplexação

## Multiplexação

No host remetente, vários processos podem utilizar simultaneamente a rede.

A camada de transporte recebe dados de diferentes sockets, adiciona informações de cabeçalho e entrega os segmentos à camada de rede.

Esse processo é chamado de **multiplexação**.

De forma conceitual:

```text
Processo 1 ─┐
Processo 2 ─┼─> Camada de Transporte ─> Camada de Rede
Processo 3 ─┘
```

---

## Demultiplexação

No host receptor, o processo inverso precisa ocorrer.

Ao receber um segmento, a camada de transporte precisa determinar para qual socket/processo os dados devem ser entregues.

Esse processo é chamado de **demultiplexação**.

```text
Camada de Rede
      |
      v
Camada de Transporte
   /     |     \
  v      v      v
P1      P2      P3
```

Assim:

\[
\boxed{
\text{demultiplexação}
=
\text{entregar o segmento ao socket correto}.
}
\]

---

# Demultiplexação no UDP

Para UDP, o socket receptor é identificado principalmente pelo endereço de destino:

\[
(\text{IP de destino},\text{porta de destino}).
\]

Datagramas UDP provenientes de diferentes remetentes podem ser entregues ao mesmo socket quando possuem o mesmo destino.

Por isso, quando um servidor UDP recebe um datagrama, ele também precisa saber **quem o enviou** caso queira responder.

Em programação de sockets, uma chamada como:

```python
data, address = recvfrom(...)
```

retorna:

- os dados;
- o endereço do remetente.

Depois, o servidor pode utilizar:

```python
sendto(data, address)
```

para enviar a resposta ao cliente correto.

---

# Demultiplexação no TCP

Uma conexão TCP é identificada por quatro valores:

\[
\boxed{
(
IP_{\text{origem}},
porta_{\text{origem}},
IP_{\text{destino}},
porta_{\text{destino}}
)
}
\]

Portanto, diferentes clientes podem utilizar a mesma porta de destino do servidor e ainda assim possuir conexões TCP diferentes.

Por exemplo:

```text
Cliente A: 10.0.0.1:50000 ─┐
                            ├─> Servidor: 10.0.0.10:80
Cliente B: 10.0.0.2:51000 ─┘
```

As duas conexões são diferenciadas pelos quatro campos.

---

# Servidor UDP

Um servidor UDP típico pode executar continuamente:

```python
while True:
    data, client_address = recvfrom(...)
    ...
    sendto(response, client_address)
```

Como UDP não estabelece uma conexão, a aplicação precisa conservar, para cada datagrama recebido, a informação necessária para saber a qual cliente enviar a resposta.

Isso não significa que UDP não possua demultiplexação: a demultiplexação UDP é realizada pela camada de transporte usando os campos de destino.

O endereço retornado por `recvfrom()` é utilizado pela aplicação quando ela precisa responder ao remetente correto.

---

# UDP e o sistema operacional

UDP também é implementado pelo sistema operacional, assim como TCP.

A diferença é que UDP oferece um serviço muito mais simples.

Mecanismos que não são fornecidos pelo UDP, como:

- retransmissão;
- ordenação;
- controle de sessão;
- confiabilidade adicional;

precisam ser implementados pela aplicação caso sejam necessários.

---

# UDP Checksum

UDP utiliza um **checksum** para detectar corrupção de bits.

A ideia básica é:

1. dividir os dados em palavras;
2. realizar uma soma utilizando aritmética de complemento de 1;
3. inserir o complemento do resultado no campo de checksum;
4. no receptor, refazer o cálculo para verificar a integridade.

O checksum fornece:

\[
\boxed{
\text{detecção de erros}
}
\]

mas não fornece, sozinho:

- correção do erro;
- retransmissão;
- garantia de entrega.

Portanto:

\[
\boxed{
\text{checksum detecta; não corrige}.
}
\]

Outra característica é que o checksum da Internet é relativamente simples e não consegue detectar absolutamente todos os padrões possíveis de corrupção.

---

## Por que usar checksum no UDP?

Mesmo que algumas tecnologias de enlace também realizem detecção de erros, não há garantia de que todos os enlaces do caminho façam isso.

Além disso, erros também podem ocorrer durante processamento ou armazenamento intermediário.

Por isso, o UDP realiza detecção de erros fim a fim na camada de transporte.

---

# Ausência de Handshake no UDP

TCP realiza um handshake antes da troca normal de dados.

UDP não.

Portanto:

\[
\boxed{
\text{UDP não possui handshake de estabelecimento de conexão}.
}
\]

Isso contribui para que seja um protocolo mais simples e leve.

---

# Introdução ao Reliable Data Transfer — RDT

A aula termina preparando o estudo de **Reliable Data Transfer (RDT)**.

O problema central é:

> Como construir transferência confiável quando o canal subjacente pode apresentar erros?

Entre os problemas que serão considerados estão:

- corrupção de bits;
- perda de pacotes;
- necessidade de saber se uma mensagem chegou corretamente.

Uma ideia inicial é o modelo **stop-and-wait**:

1. o emissor envia um pacote;
2. espera uma confirmação;
3. só depois envia o próximo.

Esse princípio será refinado nas diferentes versões do RDT.

---

## ACK e NAK

Uma forma de informar ao emissor o resultado da recepção é utilizar:

- **ACK** (*Acknowledgment*): confirmação de que o pacote foi recebido corretamente;
- **NAK** (*Negative Acknowledgment*): indicação de que houve problema na recepção.

Esses mecanismos serão utilizados no desenvolvimento dos protocolos de transferência confiável.

> **Observação:** as versões específicas do RDT aparecem apenas como indicação para a continuação da matéria nesta aula. O desenvolvimento detalhado fica para a aula seguinte.

---

# Resumo

Os principais tópicos desta aula foram:

- revisão dos modelos $M/M/1$ e $M/D/1$;
- PASTA e tempo residual de serviço;
- programação com sockets TCP;
- operações bloqueantes;
- início da camada de transporte;
- host identificado por IP e processo identificado por porta;
- multiplexação e demultiplexação;
- diferenças entre demultiplexação UDP e TCP;
- UDP como protocolo connectionless;
- checksum UDP;
- introdução à transferência confiável de dados;
- ideia de stop-and-wait e ACK/NAK.

