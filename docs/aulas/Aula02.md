# Aula 02 — 14/08/2026

# Continuação — Introdução às Redes

## Visão global e visão local da rede

Podemos analisar uma rede a partir de diferentes perspectivas.

### Visão global

Na **visão global**, procura-se observar a rede como um todo, considerando os diferentes dispositivos e redes que estão interconectados.

Essa visão é útil para compreender como os diversos componentes formam uma rede maior, como a Internet.

### Visão local

Na **visão local**, analisamos aquilo que está próximo de um determinado dispositivo ou rede.

Nesse caso, não é necessário que um dispositivo conheça toda a estrutura da Internet para conseguir se comunicar. Ele precisa saber como alcançar o próximo elemento responsável por encaminhar seus dados.

Um exemplo importante é o uso de um **roteador**, que permite conectar uma rede local a outras redes.

---

## Rede de acesso

A **rede de acesso** (*access network*) é responsável por conectar os sistemas finais (*end systems*) ao restante da rede.

De maneira simplificada:

\[
\text{Host}
\longrightarrow
\text{Rede de acesso}
\longrightarrow
\text{Roteador}
\longrightarrow
\text{Internet}.
\]

Diferentes tecnologias podem ser utilizadas como redes de acesso.

### Wi-Fi

No Wi-Fi, um dispositivo se conecta sem fio a um **Access Point (AP)**.

\[
\text{Host}
\xleftrightarrow{\text{Wi-Fi}}
\text{AP}
\longrightarrow
\text{Rede}.
\]

O Access Point funciona como ponto de acesso do dispositivo à rede.

### Redes móveis

Outro exemplo são as redes celulares, como o **5G**.

Nesse caso, o dispositivo móvel utiliza a infraestrutura da operadora para obter acesso à rede.

\[
\text{Celular}
\xleftrightarrow{\text{5G}}
\text{Rede da operadora}
\longrightarrow
\text{Internet}.
\]

> **Observação:** foi mencionado em aula o curso **"5G for Everyone"**, da Coursera.

---

# Protocolos

Um protocolo define as regras utilizadas durante uma comunicação.

Uma definição apresentada em aula foi:

> Protocols define the format, order of messages sent and received among...

Ou seja, um protocolo especifica aspectos como:

- o **formato** das mensagens;
- a **ordem** em que as mensagens são enviadas e recebidas;
- as ações realizadas durante a comunicação.

Dessa forma, para que duas partes consigam se comunicar corretamente, ambas precisam conhecer e seguir o protocolo utilizado.

---

## Pilha de protocolos

A comunicação em redes é organizada em **camadas**.

Cada camada possui uma função específica e utiliza protocolos adequados àquela função.

Uma representação simplificada da pilha apresentada em aula é:

| Camada | Exemplo |
|---|---|
| Aplicação | HTTP |
| Transporte | TCP |
| Rede | IP |
| Acesso ao meio | Ethernet / Wi-Fi |
| Física | sinais/frequências |

A organização em camadas permite separar as diferentes responsabilidades envolvidas em uma comunicação.

Por exemplo:

- **HTTP** estabelece regras utilizadas por aplicações Web;
- **TCP** fornece um protocolo de transporte;
- **IP** está relacionado ao encaminhamento de pacotes entre redes;
- protocolos de acesso ao meio tratam da comunicação no enlace;
- a camada física trata da transmissão efetiva dos sinais pelo meio.

---

# Comunicação na rede

## TCP e UDP

Na camada de transporte, dois protocolos importantes são:

- **TCP** (*Transmission Control Protocol*);
- **UDP** (*User Datagram Protocol*).

Uma diferença importante destacada em aula está relacionada ao estabelecimento de estado entre as partes.

### TCP

O TCP é **orientado à conexão**.

Antes da troca normal de dados, é estabelecido um estado de conexão entre cliente e servidor.

De forma simplificada:

\[
\text{Cliente}
\longleftrightarrow
\text{Servidor}.
\]

Essa conexão permite ao TCP manter informações relacionadas à comunicação entre as duas extremidades.

### UDP

O UDP é **não orientado à conexão**.

Não há o mesmo estabelecimento prévio de uma conexão mantida entre cliente e servidor.

Assim, uma representação conceitual é:

\[
\text{TCP}
\qquad\longrightarrow\qquad
\text{UDP}
\]

com diferentes níveis de estado associado à comunicação.

---

## QUIC

Também foi mencionado o protocolo **QUIC**.

O QUIC está relacionado à comunicação moderna na Internet e utiliza **UDP** como protocolo de transporte subjacente.

\[
\text{QUIC}
\longrightarrow
\text{UDP}.
\]

A ideia é utilizar UDP como base e implementar sobre ele mecanismos adicionais necessários à comunicação.

> **Observação:** QUIC foi citado em aula junto à discussão sobre TCP e UDP, sem um desenvolvimento detalhado do protocolo.

---

# Compartilhamento de recursos

Um aspecto importante das redes é o **compartilhamento de recursos**.

Quando diferentes usuários utilizam uma mesma infraestrutura, os recursos disponíveis precisam ser divididos entre eles.

Um exemplo é a capacidade de transmissão de um enlace:

\[
R = \text{capacidade do enlace}.
\]

Se vários usuários utilizam simultaneamente esse enlace, sua capacidade precisa ser compartilhada.

Existem diferentes formas de realizar esse compartilhamento.

---

## Compartilhamento de recursos e garantia

Uma questão importante é se o compartilhamento oferece ou não uma **garantia de recursos** para cada usuário.

Em algumas técnicas, uma parte dos recursos pode ser reservada antecipadamente para determinada comunicação.

Isso fornece previsibilidade, mas pode causar desperdício quando o recurso reservado não está sendo utilizado.

---

# Circuit Switching

No **circuit switching** (comutação de circuitos), recursos são reservados para uma comunicação.

Durante a comunicação, cada usuário recebe uma parcela previamente determinada da capacidade disponível.

Uma consequência importante é que os recursos reservados permanecem destinados àquela comunicação mesmo quando ela não os utiliza em determinado instante.

Assim:

> **Vantagem:** existe garantia de recursos.

> **Desvantagem:** pode haver desperdício de capacidade.

---

## Compartilhamento por frequência — FDMA

Uma maneira de dividir os recursos é através da frequência.

No **FDMA** (*Frequency Division Multiple Access*), diferentes usuários recebem diferentes faixas de frequência.

Se a banda disponível é dividida em várias faixas:

\[
B = B_1 + B_2 + \cdots + B_n,
\]

cada comunicação pode utilizar uma faixa específica.

De forma conceitual:

\[
\begin{array}{|c|c|c|c|}
\hline
f_1 & f_2 & f_3 & f_4 \\
\hline
\end{array}
\]

Cada faixa pode ser reservada para um usuário diferente.

---

## Compartilhamento por tempo — TDMA

Outra possibilidade é dividir o recurso no tempo.

No **TDMA** (*Time Division Multiple Access*), diferentes usuários utilizam o meio em diferentes intervalos de tempo.

Por exemplo:

\[
\begin{array}{|c|c|c|c|}
\hline
U_1 & U_2 & U_3 & U_1 \\
\hline
\end{array}
\]

Cada usuário recebe determinados *slots* de tempo para transmitir.

---

## Compartilhamento por código — CDMA

Também é possível realizar a separação através de códigos.

No **CDMA** (*Code Division Multiple Access*), diferentes usuários podem compartilhar o meio utilizando códigos distintos.

Assim, as três formas de divisão mencionadas em aula foram:

- frequência $\rightarrow$ **FDMA**;
- tempo $\rightarrow$ **TDMA**;
- código $\rightarrow$ **CDMA**.

---

## Circuit switching e compartilhamento

Em circuit switching, a divisão dos recursos pode ser realizada, por exemplo, através de FDMA ou TDMA.

A principal característica é a **reserva de recursos**.

Isso traz a vantagem de oferecer uma capacidade previamente determinada para a comunicação:

\[
\text{recurso reservado}
\Rightarrow
\text{garantia de capacidade}.
\]

Entretanto, se um usuário não utilizar sua parcela em determinado instante, essa capacidade pode permanecer ociosa.

Portanto:

\[
\boxed{\text{Garantia de recursos}}
\]

é uma vantagem importante do circuit switching, enquanto

\[
\boxed{\text{Possível desperdício de recursos}}
\]

é uma de suas principais desvantagens.

---

## Ponto importante — compartilhamento da rede

Um ponto destacado em aula é diferenciar formas de redes em que há **compartilhamento de recursos**.

Quando um recurso é previamente reservado, existe uma garantia para determinado usuário, mas essa reserva reduz a flexibilidade de utilização da capacidade total.

Essa discussão será importante para comparar diferentes formas de utilização da infraestrutura de uma rede.