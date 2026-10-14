# Aula 16 — 14/10/2026

## Capítulo 3 — Camada de Transporte

### Continuação

Foram retomados os tópicos:

- RDT;
- GBN e SR;
- TCP.

### Hoje

Os objetivos anotados para a aula foram:

- completar TCP para confiabilidade;
- começar controle de congestionamento;
- discutir como o TCP implementa aspectos de GBN e SR.

---

## TCP e confiabilidade

### Cumulative ACKs

O TCP trabalha com **ACKs cumulativos**.

Uma vantagem anotada é:

- transmitir menos ACKs.

Há também a observação de que o mecanismo permite acompanhar/confirmações de forma cumulativa.

### Acknowledgment Number

Nas anotações, o **Acknowledgment Number** é relacionado ao número que se espera receber em seguida.

Foi anotado, no exemplo apresentado em sala, que:

- no envio do primeiro pacote, o valor inicialmente considerado é $0$, pois ainda não há nada a confirmar;
- a partir da confirmação, o valor passa para $1$.

> **Observação:** o exemplo numérico aparece de forma abreviada nas anotações e foi mantido apenas no nível em que está legível.

---

## Controle de fluxo

O **controle de fluxo** aparece associado à:

**receiver window**.

Nas anotações:

> aparece no cabeçalho no TCP.

Também foi registrado que o **controle de congestionamento** não aparece da mesma forma como um campo explícito fornecido pela rede.

---

## Retransmissão específica

Foi destacada como vantagem:

> retransmitir menos.

A ideia aparece relacionada ao modo como o TCP aproveita características de GBN e SR.

---

## Observação sobre DNS e UDP

Foi anotado que o DNS utiliza UDP devido ao fato de suas mensagens serem curtas.

A observação feita em sala foi que, usando TCP em mensagens muito pequenas, o cabeçalho poderia representar uma parcela muito grande da própria mensagem.

> **Observação:** este trecho está transcrito conforme a anotação da aula.

---

## Estimativa de RTT no TCP

Para definir o timeout, o TCP precisa estimar o RTT.

Nas anotações, isso aparece como uma forma simples de um **estimador de média**.

A relação anotada é:

$$
\text{EstimatedRTT}
=
(1-\alpha)\,\text{EstimatedRTT}
+
\alpha\,\text{SampleRTT}.
$$

Usando a notação da aula:

$$
\bar R_t
\leftarrow
(1-\alpha)\bar R
+
\alpha\theta_t,
$$

onde $\theta_t$ representa uma nova amostra de RTT.

Foi anotado também:

$$
\bar R_0=\theta_0,
$$

e, para a atualização seguinte,

$$
\bar R_1
\leftarrow
(1-\alpha)\bar R_0
+
\alpha\theta_1.
$$

Ao expandir sucessivamente o estimador, o peso das amostras anteriores decai exponencialmente.

> **Anotação da aula:** “decai exponencialmente”.

---

## Escolha do timeout

A ideia registrada é:

> precisamos aprender o RTT para setar o timeout.

O timeout não deve ser escolhido muito próximo da estimativa de RTT.

A expressão anotada é:

$$
\boxed{
\text{TimeoutInterval}
=
\text{EstimatedRTT}
+
4\,\text{DevRTT}
}
$$

O termo com `DevRTT` aparece indicado como uma **margem de segurança**.

A justificativa anotada é que um timeout muito pequeno leva a um **timeout prematuro**, enquanto um valor muito grande pode fazer o sistema esperar por tempo excessivo.

---

## Desigualdade de Markov

Foi utilizada a desigualdade de Markov para raciocinar sobre a probabilidade de cauda de uma variável aleatória.

A relação anotada é:

$$
\boxed{
P(X>a)
\leq
\frac{E[X]}{a}
}
$$

A derivação apresentada em sala parte de:

$$
E[X]
=
E[X\mid X>a]P(X>a)
+
E[X\mid X<a]P(X<a).
$$

Como o segundo termo é não negativo:

$$
E[X]
\geq
E[X\mid X>a]P(X>a).
$$

E, para $X>a$:

$$
E[X\mid X>a]\geq a.
$$

Portanto:

$$
E[X]
\geq
aP(X>a),
$$

o que fornece:

$$
P(X>a)
\leq
\frac{E[X]}{a}.
$$

Foi anotado que essa desigualdade permite falar sobre a probabilidade de cauda utilizando apenas a média da variável aleatória, sem precisar conhecer toda a distribuição.

### Aplicação ao RTT

Nas anotações:

$$
X=RTT.
$$

A proposta é calcular uma probabilidade do tipo:

$$
P(X>a),
$$

interpretada como a probabilidade de ocorrer um **timeout prematuro** para determinado limiar $a$.

---

## Desigualdade de Chebyshev

Também foi utilizada a desigualdade de Chebyshev:

$$
\boxed{
P\left(|X-E[X]|>a\right)
\leq
\frac{\sigma^2}{a^2}
}
$$

Foi considerado o caso de um limite a quatro desvios-padrão da média:

$$
P(X>\bar R+4\sigma)
\leq
\frac{\sigma^2}{(4\sigma)^2}
=
\frac{1}{16}.
$$

Assim, foi anotado que, usando $4\sigma$, a probabilidade fica limitada por:

$$
\frac{1}{16}.
$$

### Comparação visual com uma Gaussiana

No desenho feito em sala aparece uma distribuição aproximadamente Gaussiana, com um ponto a:

$$
4\sigma
$$

da média e uma pequena região de cauda.

A anotação junto ao gráfico indica aproximadamente:

$$
0{,}003\%.
$$

> **Observação:** o valor acima foi apenas transcrito do gráfico da aula.

---

## Timeout e tamanho da janela

Na parte final da aula foi discutida a relação entre timeout e **window size**.

A anotação começa destacando que, no TCP clássico, não há inicialmente uma relação direta simples entre:

- timeout;
- tamanho da janela.

Também aparecem como comparação mecanismos/versões mais modernos, com menção a:

- QUIC;
- BBR;

associados, nas anotações, à ideia de estimar vazão a partir de informações como o RTT.

Na abordagem mais simples, foi registrado que a ocorrência de um timeout pode ser utilizada como indicação de perda.

A partir dessa informação, pode-se reduzir o tamanho da janela.

> **Trecho final pouco legível:** há uma anotação terminando em “... otimiza $W$”, mas o início dessa frase não está suficientemente claro para uma transcrição confiável.

---

## Resumo

Os principais pontos desta aula foram:

- continuação do estudo de TCP;
- TCP como mecanismo confiável baseado em ideias de GBN e SR;
- ACKs cumulativos;
- `Acknowledgment Number`;
- controle de fluxo e `receiver window`;
- retransmissão específica;
- estimativa de RTT;
- atualização de `EstimatedRTT` a partir de `SampleRTT`;
- escolha do timeout com margem de segurança;
- `TimeoutInterval = EstimatedRTT + 4 DevRTT`;
- desigualdade de Markov;
- desigualdade de Chebyshev;
- uso dessas desigualdades para pensar em timeout prematuro;
- relação entre timeout, perda e tamanho da janela;
- introdução ao controle de congestionamento.

---


