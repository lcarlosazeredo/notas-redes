# Aula 14 — 30/09/2026

## Capítulo 3 — Reliable Data Transfer

Um dos principais objetivos da camada de transporte é fornecer **transferência confiável de dados** (*Reliable Data Transfer — RDT*).

Dois pontos importantes no desenvolvimento dos protocolos de transporte são:

- **confiabilidade**;
- **eficiência**.

Nas anotações, foi feita também uma distinção entre dois tipos de problemas:

- **confiabilidade**: considera falhas não estratégicas, como perdas ou corrupção acidental de dados;
- **segurança**: considera também a existência de um atacante estratégico.

---

## Construção incremental do RDT

Os protocolos RDT são construídos de forma incremental.

A ideia é começar com uma rede ideal e, progressivamente, adicionar novos tipos de falha:

$$
\text{rdt1.0}
\rightarrow
\text{rdt2.0}
\rightarrow
\text{rdt2.1}
\rightarrow
\text{rdt2.2}
\rightarrow
\text{rdt3.0}.
$$

Quanto mais tipos de falha admitimos para o canal, mais mecanismos precisam ser adicionados ao protocolo.

| Protocolo | Hipótese sobre o canal | Mecanismo acrescentado |
|---|---|---|
| rdt1.0 | canal totalmente confiável | nenhum mecanismo adicional |
| rdt2.0 | pacotes de dados podem ser corrompidos | checksum, ACK/NAK e retransmissão |
| rdt2.1 | ACK/NAK também podem ser corrompidos | número de sequência |
| rdt2.2 | mesmo modelo do rdt2.1 | elimina o NAK, utilizando somente ACKs |
| rdt3.0 | pacotes ou ACKs podem ser perdidos | temporizador e timeout |

O TCP utiliza vários desses princípios:

- checksum;
- números de sequência;
- ACKs;
- retransmissões;
- temporizadores.

O TCP não utiliza explicitamente NAKs da forma apresentada no rdt2.0.

> **Observação:** o UDP não fornece transferência confiável, retransmissão ou ordenação. Entretanto, ele possui checksum para detecção de erros; portanto, não é correto dizer literalmente que o UDP "não implementa nada".

---

## Hipótese de não reordenação

Durante a construção inicial dos protocolos RDT, assume-se que o canal **não reordena os pacotes**.

Ou seja, um pacote transmitido depois de outro não aparece arbitrariamente antes dele devido ao comportamento do canal modelado.

Essa hipótese simplifica o desenvolvimento inicial dos protocolos.

### TTL

O TTL (*Time To Live*) limita por quanto tempo um datagrama pode continuar circulando na rede.

> **Correção conceitual:** apesar do nome *Time To Live*, no IPv4 o TTL não representa diretamente um tempo em segundos. Seu valor é decrementado a cada roteador atravessado. Quando chega a zero, o datagrama é descartado. O objetivo é evitar que datagramas permaneçam circulando indefinidamente.

---

## Serviço de transferência confiável

Na prática, a rede subjacente não é necessariamente confiável.

O objetivo do RDT é fazer com que:

- emissor;
- receptor;

tenham a impressão de utilizar um canal confiável, mesmo que o canal inferior possa apresentar falhas.

De forma abstrata:

```text
Aplicação emissora
       |
   rdt_send()
       |
       v
     RDT
       |
   udt_send()
       |
======= canal não confiável =======
       |
   rdt_rcv()
       |
       v
     RDT
       |
 deliver_data()
       |
Aplicação receptora
```

As operações principais são:

- `rdt_send(data)`: a camada superior entrega dados ao protocolo RDT;
- `udt_send(packet)`: o RDT envia um pacote pelo canal não confiável;
- `rdt_rcv(packet)`: indica a chegada de um pacote vindo do canal;
- `deliver_data(data)`: entrega os dados corretamente recebidos à aplicação.

O objetivo é esconder da aplicação os problemas existentes no canal inferior.

---

## rdt1.0 — Canal perfeitamente confiável

O **rdt1.0** considera a situação mais simples possível:

$$
\boxed{\text{canal totalmente confiável}}
$$

Nesse modelo:

- não há corrupção;
- não há perda;
- não há necessidade de retransmissão.

O emissor simplesmente envia os dados e o receptor os entrega à aplicação.

Essa versão serve como ponto inicial para a construção dos protocolos seguintes.

---

## rdt2.0 — Canal com corrupção de bits

No **rdt2.0**, passamos a admitir que um pacote possa chegar corrompido.

Para detectar corrupção, utiliza-se:

$$
\boxed{\text{checksum}}
$$

Depois de receber um pacote, o receptor responde com:

- `ACK`: pacote recebido corretamente;
- `NAK`: pacote recebido com erro.

O emissor permanece esperando uma dessas respostas.

```text
Emissor                           Receptor
   |                                 |
   | -------- pacote --------------> |
   |                                 |
   | <--------- ACK ---------------- |
   |                                 |
```

Se ocorrer erro:

```text
Emissor                           Receptor
   |                                 |
   | -------- pacote -----X--------> |
   |                                 |
   | <--------- NAK ---------------- |
   |                                 |
   | ---- retransmissão -----------> |
```

Assim:

- recebeu `ACK` $\Rightarrow$ envia o próximo pacote;
- recebeu `NAK` $\Rightarrow$ retransmite o pacote atual.

Esse comportamento é chamado de:

$$
\boxed{\text{stop-and-wait}}
$$

porque o emissor envia um pacote e precisa esperar uma resposta antes de enviar o próximo.

---

## Número esperado de transmissões

Considere que cada tentativa tenha probabilidade $p$ de sucesso.

Seja $T$ o número de transmissões necessárias até o primeiro sucesso.

Então:

$$
T\sim\operatorname{Geom}(p).
$$

Logo:

$$
E[T]=\frac{1}{p}.
$$

Se a primeira transmissão não for considerada uma retransmissão, o número médio de **retransmissões** é:

$$
E[R]
=
E[T]-1.
$$

Portanto:

$$
\boxed{
E[R]
=
\frac{1}{p}-1.
}
$$

Quanto menor a probabilidade de sucesso, maior será o número esperado de retransmissões.

---

## Problema do rdt2.0

O rdt2.0 resolve a corrupção do **pacote de dados**, mas surge outro problema:

> E se o próprio ACK ou NAK for corrompido?

Suponha:

```text
Emissor                           Receptor
   |                                 |
   | -------- pacote --------------> |
   |                                 |
   | <------ ACK corrompido ---X---- |
```

O emissor não consegue saber se o receptor:

- recebeu corretamente o pacote;
- recebeu um pacote corrompido.

Uma possibilidade é retransmitir o pacote.

Entretanto, se o receptor já tiver recebido corretamente o pacote anterior, essa retransmissão produzirá uma **duplicata**.

---

## rdt2.1 — Números de sequência

O **rdt2.1** resolve a ambiguidade das retransmissões utilizando **números de sequência**.

No protocolo stop-and-wait, bastam dois valores:

$$
0
\qquad\text{e}\qquad
1.
$$

Os pacotes passam a alternar:

$$
0,1,0,1,0,1,\ldots
$$

Assim, o receptor consegue diferenciar:

- um pacote novo;
- uma retransmissão do pacote anterior.

Por exemplo, se o receptor já recebeu corretamente o pacote `0` e recebe outro pacote `0`, ele sabe que se trata de uma retransmissão.

Ele pode enviar novamente o ACK correspondente, mas **não entrega os dados duas vezes à aplicação**.

---

### Alternating-Bit Protocol

Como os números de sequência alternam entre:

$$
0
\quad\text{e}\quad
1,
$$

essa ideia também é conhecida como **Alternating-Bit Protocol**.

O emissor passa a ter estados como:

- esperando dados para enviar com sequência `0`;
- esperando ACK do pacote `0`;
- esperando dados para enviar com sequência `1`;
- esperando ACK do pacote `1`.

O receptor também precisa saber qual número de sequência espera naquele momento.

---

## Número de sequência e tamanho da janela

No stop-and-wait, existem apenas dois casos relevantes:

$$
0
\quad\text{e}\quad
1.
$$

Quando posteriormente utilizamos protocolos com **janelas**, o espaço de números de sequência precisa ser maior.

> **Correção conceitual:** nas anotações aparece a regra de que, para uma janela de tamanho $J$, seriam necessários $2J$ números de sequência. Essa condição é particularmente importante no **Selective Repeat**, em que o espaço de números de sequência deve ter pelo menos o dobro do tamanho da janela:
>
> $$
> \boxed{
> |\text{espaço de sequência}|\geq 2J.
> }
> $$
>
> Ela não deve ser aplicada indistintamente a todos os protocolos de janela; o Go-Back-N possui uma restrição diferente.

---

## rdt2.2 — Protocolo sem NAK

O **rdt2.2** mantém a ideia do rdt2.1, mas elimina o uso explícito de NAK.

Assim:

$$
\boxed{
\text{rdt2.2 utiliza apenas ACKs}.
}
$$

Quando o receptor recebe corretamente um pacote, envia um ACK indicando o número de sequência recebido.

Se chegar um pacote corrompido ou inesperado, o receptor pode reenviar o ACK referente ao **último pacote recebido corretamente**.

Por exemplo:

```text
ACK0
```

significa que o último pacote corretamente recebido foi o pacote de sequência `0`.

Um ACK duplicado pode, portanto, indicar ao emissor que o próximo pacote não foi recebido corretamente.

---

## rdt3.0 — Canal com perdas

O **rdt3.0** passa a considerar também a possibilidade de:

$$
\boxed{\text{perda de pacotes}}
$$

ou de ACKs.

Nesse caso, o emissor pode enviar um pacote e simplesmente não receber nenhuma resposta.

O mecanismo acrescentado é um:

$$
\boxed{\text{temporizador}}
$$

Se o ACK esperado não chegar antes do timeout:

$$
\boxed{
\text{timeout}
\Rightarrow
\text{retransmissão}.
}
$$

---

### Timeout prematuro

Um timeout não significa necessariamente que houve perda.

Pode acontecer de:

- o pacote estar apenas muito atrasado;
- o ACK estar atrasado.

Nesse caso, o temporizador pode expirar antes da chegada da resposta.

O emissor retransmite o pacote, criando uma duplicata.

Os números de sequência já introduzidos no rdt2.1 permitem ao receptor detectar essa situação.

Assim:

$$
\boxed{
\text{checksum}
+
\text{ACK}
+
\text{número de sequência}
+
\text{retransmissão}
+
\text{timeout}
}
$$

formam os principais mecanismos utilizados pelo rdt3.0.

---

## Escolha do timeout

Para escolher o timeout, é necessário levar em consideração o **RTT** (*Round-Trip Time*), isto é, o tempo necessário para:

1. o pacote ir do emissor ao receptor;
2. o ACK retornar ao emissor.

De maneira conceitual:

$$
\text{timeout}
=
\text{RTT esperado}
+
\text{margem de segurança}.
$$

Essa margem precisa considerar a variação do RTT.

Um timeout muito pequeno causa:

- retransmissões desnecessárias;
- duplicação de pacotes.

Um timeout excessivamente grande causa:

- recuperação muito lenta quando realmente existe perda.

Portanto, é necessário buscar um equilíbrio:

$$
\boxed{
\text{timeout nem muito pequeno, nem muito grande}.
}
$$

---

## Problema de eficiência do Stop-and-Wait

Embora o rdt3.0 possa fornecer confiabilidade, ele possui um problema importante de **eficiência**.

No stop-and-wait:

1. o emissor transmite um pacote;
2. fica parado esperando o ACK;
3. somente depois envia o próximo pacote.

Considere:

- pacote de tamanho $L$;
- enlace de taxa $R$;
- RTT da comunicação.

O tempo de transmissão do pacote é:

$$
\frac{L}{R}.
$$

A utilização do emissor é aproximadamente:

$$
\boxed{
U_{\text{sender}}
=
\frac{L/R}
{RTT+L/R}.
}
$$

No exemplo anotado em sala, essa utilização é extremamente baixa, aproximadamente:

$$
U_{\text{sender}}\approx0{,}00027.
$$

Isso significa que, durante a maior parte do tempo, o emissor está simplesmente esperando uma resposta.

---

## Pipelining

Para aumentar a eficiência, podemos permitir que o emissor envie vários pacotes sem esperar individualmente o ACK de cada um.

Essa técnica é chamada:

$$
\boxed{\text{pipelining}}.
$$

Por exemplo:

```text
Emissor                         Receptor
   |                               |
   | -------- pacote 0 ----------> |
   | -------- pacote 1 ----------> |
   | -------- pacote 2 ----------> |
   |                               |
   | <---------- ACKs ------------ |
```

Se forem enviados três pacotes consecutivos, a utilização pode ser representada por:

$$
U_{\text{sender}}
=
\frac{3L/R}
{RTT+L/R}.
$$

No exemplo da aula:

$$
U_{\text{sender}}\approx0{,}00081.
$$

Mesmo neste pequeno exemplo:

$$
0{,}00081
=
3(0{,}00027),
$$

mostrando que enviar mais de um pacote antes de esperar pelos ACKs aumenta a utilização do enlace.

A ideia geral é manter vários pacotes **em voo** ao mesmo tempo.

---

## Protocolos com janela

Para implementar pipelining, o emissor trabalha com uma **janela** de pacotes que podem ser enviados sem que seus ACKs tenham chegado.

Duas formas importantes de fazer isso são:

- **Go-Back-N (GBN)**;
- **Selective Repeat (SR)**.

---

## Go-Back-N — GBN

No **Go-Back-N**, o emissor pode possuir até $N$ pacotes não confirmados simultaneamente.

O receptor utiliza **ACK cumulativo**.

Um ACK para o pacote $k$ indica que todos os pacotes até $k$ foram recebidos corretamente e em ordem.

Por exemplo:

$$
ACK(4)
$$

indica que os pacotes:

$$
0,1,2,3,4
$$

foram recebidos em ordem.

### Perda de um pacote

Suponha:

```text
0  1  2  3  4
      X
```

Se o pacote `2` for perdido, os pacotes posteriores chegam fora de ordem.

No modelo clássico do GBN, o receptor:

- descarta pacotes fora de ordem;
- continua enviando ACK para o último pacote recebido corretamente em ordem.

Se ocorrer timeout para o pacote mais antigo ainda não confirmado, o emissor retransmite esse pacote e todos os posteriores ainda não confirmados.

Daí o nome:

$$
\boxed{\text{Go-Back-N}}.
$$

### Característica importante

O receptor do GBN é simples, pois não precisa manter em buffer os pacotes recebidos fora de ordem.

---

## Selective Repeat — SR

No **Selective Repeat**, o objetivo é evitar retransmissões desnecessárias.

Se apenas um pacote for perdido, somente o pacote necessário é retransmitido.

Assim:

$$
\boxed{
\text{SR retransmite seletivamente os pacotes perdidos ou corrompidos}.
}
$$

O receptor:

- confirma individualmente os pacotes corretamente recebidos;
- pode aceitar pacotes fora de ordem;
- mantém esses pacotes em buffer;
- entrega os dados à aplicação quando os pacotes faltantes chegam.

### Comparação

| Go-Back-N | Selective Repeat |
|---|---|
| ACKs cumulativos | ACKs individuais |
| descarta pacotes fora de ordem | armazena pacotes fora de ordem |
| retransmite vários pacotes após timeout | retransmite apenas os necessários |
| receptor mais simples | receptor mais complexo |
| pode desperdiçar transmissões | utiliza melhor a capacidade |

---

## Relação com TCP

O TCP utiliza diversos mecanismos vistos durante a construção dos protocolos RDT:

- números de sequência;
- ACKs;
- checksum;
- retransmissões;
- temporizadores;
- janela.

O comportamento real do TCP não é simplesmente um GBN ou um SR puro, mas esses protocolos fornecem os princípios fundamentais para compreender seu funcionamento.

---

## Resumo

A evolução estudada nesta aula pode ser resumida por:

$$
\boxed{
\begin{aligned}
\text{rdt1.0}&:\text{ canal confiável}\\
\text{rdt2.0}&:\text{ corrupção }+\text{ ACK/NAK}\\
\text{rdt2.1}&:\text{ números de sequência}\\
\text{rdt2.2}&:\text{ apenas ACKs}\\
\text{rdt3.0}&:\text{ perda }+\text{ timeout}
\end{aligned}
}
$$

O rdt3.0 resolve o problema de confiabilidade, mas continua limitado pela baixa eficiência do **stop-and-wait**.

Para melhorar o desempenho, utilizamos:

$$
\boxed{
\text{pipelining}
\rightarrow
\text{protocolos de janela}
}
$$

com duas estratégias principais:

$$
\boxed{
\text{Go-Back-N}
\qquad\text{e}\qquad
\text{Selective Repeat}.
}
$$

