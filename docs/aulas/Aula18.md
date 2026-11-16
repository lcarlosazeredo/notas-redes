# Aula 18 — 21/10/2026

> **Base principal:** anotações manuscritas da aula.  
> **Complementos:** *Computer Networking: A Top-Down Approach*, 8ª ed., Kurose & Ross, principalmente Seção 3.7 — **TCP Congestion Control**.  
> Quando o livro completa ou esclarece uma anotação feita de forma abreviada em sala, a referência é indicada.

## Capítulo 3 — Camada de Transporte

### Retomada da aula anterior

Na aula anterior foram discutidos os **princípios do controle de congestionamento**.

Foram analisados três cenários:

- **Cenário 1:** uma fila com buffer infinito;
- **Cenário 2:** uma fila com buffer finito;
  - caso ideal, com conhecimento instantâneo do estado do sistema;
  - caso com retransmissões e conhecimento atrasado do estado do sistema;
- **Cenário 3:** múltiplas filas/caminhos, podendo ocorrer **congestion collapse**.

### Aula de hoje

O foco desta aula é:

> **Como o TCP implementa, na prática, o controle de congestionamento.**

Os principais mecanismos trabalhados são:

- AIMD;
- Slow Start;
- Congestion Avoidance;
- Fast Recovery;
- TCP CUBIC;
- relação entre perda e throughput;
- menção ao TCP BBR.

---

## Throughput e Goodput

Nas anotações aparecem duas medidas relacionadas ao desempenho.

### Throughput

O **throughput** considera a taxa total de dados/pacotes efetivamente transportados.

### Goodput

O **goodput** busca considerar apenas os dados úteis entregues, desconsiderando retransmissões.

Assim, retransmitir um pacote pode consumir capacidade da rede sem aumentar o goodput.

De forma conceitual:

$$
\boxed{
\text{Goodput}
\leq
\text{Throughput}
}
$$

Quando há muitas retransmissões, a diferença entre essas duas medidas aumenta.

---

## Como o TCP implementa controle de congestionamento

A estratégia clássica estudada é:

$$
\boxed{
\text{AIMD}
=
\text{Additive Increase}
+
\text{Multiplicative Decrease}
}
$$

O TCP tenta descobrir a capacidade disponível da rede aumentando gradualmente sua taxa.

Quando detecta congestionamento, reduz sua janela.

Isso produz o comportamento em **dente de serra** (*sawtooth*) desenhado em aula.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, p. 271, Figura 3.53.

---

## Controle reativo e preditivo

As anotações distinguem duas ideias.

### Controle reativo

No controle reativo:

1. ocorre algum sinal de problema;
2. o protocolo reage;
3. a taxa/janela é corrigida.

O AIMD clássico do TCP é essencialmente reativo:

- ACKs indicam que a rede está conseguindo entregar dados;
- perdas indicam possível congestionamento.

### Controle preditivo

Também foi discutida a ideia de antecipar o problema antes que a perda ocorra.

Nas anotações, o **BBR** aparece associado a essa visão mais preditiva/modelada.

> **Observação:** “preditivo” é a forma como essa comparação aparece nas anotações de aula. O Kurose apresenta BBR junto aos mecanismos de congestionamento baseados em atraso e modelagem da rede.

---

## Additive Increase

Na fase de **Congestion Avoidance**, o TCP aumenta a janela de congestionamento de forma aproximadamente linear.

Se:

$$
cwnd
$$

é a janela de congestionamento, então o objetivo é aumentar aproximadamente:

$$
\boxed{
1\ MSS
}
$$

a cada RTT.

Uma implementação possível é aumentar, a cada ACK:

$$
cwnd
\leftarrow
cwnd
+
MSS\left(\frac{MSS}{cwnd}\right).
$$

Após aproximadamente uma janela inteira de ACKs, o aumento acumulado é próximo de:

$$
1\ MSS.
$$

Portanto:

$$
\boxed{
\text{Additive Increase}
\Rightarrow
cwnd \text{ cresce linearmente}
}
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, pp. 267–268.

---

## Multiplicative Decrease

Quando ocorre um evento de perda associado a **três ACKs duplicados**, o TCP reduz significativamente sua janela.

Na interpretação simplificada do AIMD:

$$
\boxed{
cwnd
\leftarrow
\frac{cwnd}{2}
}
$$

Assim:

$$
\boxed{
\text{Multiplicative Decrease}
\Rightarrow
\text{janela reduzida aproximadamente pela metade}
}
$$

Depois disso, o crescimento linear recomeça.

Esse processo gera a curva em dente de serra:

```text
cwnd
 ^
 |        /|        /|        /|
 |       / |       / |       / |
 |      /  |      /  |      /  |
 |_____/   |_____/   |_____/   |____> tempo
```

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, p. 271.

---

## Relação entre `cwnd`, RTT e taxa do TCP

A taxa de envio do TCP pode ser aproximada por:

$$
\boxed{
\text{TCP rate}
\approx
\frac{cwnd}{RTT}
}
$$

Portanto:

- aumentar `cwnd` aumenta a taxa;
- diminuir `cwnd` reduz a taxa;
- para uma mesma janela, um RTT maior reduz a taxa.

Essa relação é fundamental para entender o controle de congestionamento.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, pp. 264–265.

---

## Slow Start

Apesar do nome, **Slow Start** faz a janela crescer rapidamente.

No início:

$$
cwnd
$$

possui um valor pequeno.

A cada novo ACK:

$$
\boxed{
cwnd
\leftarrow
cwnd + MSS
}
$$

Como cada segmento confirmado permite o envio de mais dados, o efeito agregado é aproximadamente:

$$
\boxed{
cwnd \text{ dobra a cada RTT}
}
$$

Portanto, o crescimento é aproximadamente **exponencial**.

Exemplo conceitual:

$$
1
\rightarrow
2
\rightarrow
4
\rightarrow
8
\rightarrow
16
\rightarrow
\cdots
$$

em unidades de MSS.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, pp. 266–267.

---

## Slow Start Threshold — `ssthresh`

O TCP utiliza a variável:

$$
ssthresh
$$

(*slow start threshold*).

Ela determina quando o crescimento exponencial do Slow Start deve dar lugar ao crescimento linear do Congestion Avoidance.

De forma simplificada:

- se:

$$
cwnd<ssthresh,
$$

o TCP permanece em **Slow Start**;

- quando:

$$
cwnd\geq ssthresh,
$$

o TCP passa para **Congestion Avoidance**.

Quando ocorre perda, o valor de `ssthresh` é ajustado em função da janela existente no momento do congestionamento.

Tipicamente:

$$
\boxed{
ssthresh
\leftarrow
\frac{cwnd}{2}
}
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, p. 267.

---

## Slow Start × Congestion Avoidance

A comparação feita em aula pode ser organizada da seguinte forma:

| Característica | Slow Start | Congestion Avoidance / AIMD |
|---|---|---|
| Crescimento | Exponencial | Linear |
| Atualização | `cwnd += MSS` por ACK | aumento total de aproximadamente `1 MSS` por RTT |
| Comportamento por RTT | aproximadamente dobra | aumenta aproximadamente `1 MSS` |
| Uso | início da conexão ou após timeout | após atingir `ssthresh` |

---

## Eventos de perda

O comportamento do TCP depende do modo como a perda é detectada.

### Timeout

Quando ocorre um timeout, o TCP interpreta o evento como um sinal mais severo de congestionamento.

No TCP descrito pelo Kurose:

$$
ssthresh
\leftarrow
\frac{cwnd}{2}
$$

e:

$$
\boxed{
cwnd
\leftarrow
1\ MSS
}
$$

O TCP volta então ao **Slow Start**.

### Três ACKs duplicados

Quando são recebidos três ACKs duplicados, ainda há evidência de que dados estão atravessando a rede.

Por isso, a reação pode ser menos agressiva.

No TCP Reno, ocorre:

- **Fast Retransmit**;
- redução da janela;
- entrada em **Fast Recovery**.

A ideia geral usada no AIMD continua sendo:

$$
cwnd
\approx
\frac{cwnd}{2}.
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, pp. 267–270, Figura 3.51.

---

## Máquina de estados simplificada

A dinâmica trabalhada em aula pode ser representada assim:

```text
                         cwnd >= ssthresh
      +------------+ --------------------------> +----------------------+
      | Slow Start |                             | Congestion Avoidance |
      +------------+ <-------------------------- +----------------------+
            |                 timeout                      |
            |                                              |
            |  3 ACKs duplicados                           | 3 ACKs duplicados
            v                                              v
                    +------------------+
                    |  Fast Recovery   |
                    +------------------+
```

No TCP Reno:

- **timeout**:
  - `ssthresh = cwnd/2`;
  - `cwnd = 1 MSS`;
  - volta ao Slow Start;

- **três ACKs duplicados**:
  - ocorre Fast Retransmit;
  - `ssthresh` é reduzido;
  - entra em Fast Recovery.

---

## AIMD e comportamento em dente de serra

Desconsiderando temporariamente o Slow Start, o comportamento em regime do TCP Reno pode ser aproximado por:

1. crescimento linear da janela;
2. ocorrência de perda;
3. redução da janela pela metade;
4. novo crescimento linear.

Se $W$ é o tamanho máximo da janela imediatamente antes de uma perda, então ela varia aproximadamente entre:

$$
\frac{W}{2}
$$

e:

$$
W.
$$

O valor médio é:

$$
\boxed{
\bar W
=
\frac{
W/2+W
}{2}
=
\frac{3W}{4}
}
$$

Assim, a taxa média aproximada é:

$$
\boxed{
\text{Throughput médio}
\approx
\frac{3W}{4RTT}
}
$$

se $W$ estiver medido em bytes.

Se $W$ estiver medido em segmentos:

$$
\boxed{
\text{Throughput médio}
\approx
\frac{3W}{4}
\frac{MSS}{RTT}
}
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, p. 273.

---

## Lei da raiz quadrada do TCP

A aula deriva a relação entre:

- probabilidade de perda;
- tamanho máximo da janela;
- throughput médio do TCP.

Considere um ciclo AIMD em que a janela cresce de:

$$
\frac{W}{2}
$$

até:

$$
W.
$$

Assuma aproximadamente **uma perda por ciclo**.

### Número de pacotes enviados em um ciclo

O número de pacotes enviados pode ser aproximado pela soma:

$$
N_{\text{ciclo}}
=
\frac{W}{2}
+
\left(\frac{W}{2}+1\right)
+
\cdots
+
W.
$$

Essa é uma progressão aritmética.

O número de termos é:

$$
\frac{W}{2}+1.
$$

A média entre o primeiro e o último termo é:

$$
\frac{
W/2+W
}{2}
=
\frac{3W}{4}.
$$

Logo:

$$
N_{\text{ciclo}}
=
\frac{3W}{4}
\left(
\frac{W}{2}+1
\right).
$$

Portanto:

$$
\boxed{
N_{\text{ciclo}}
=
\frac{3W^2}{8}
+
\frac{3W}{4}
}
$$

### Probabilidade de perda

Se ocorre aproximadamente uma perda por ciclo:

$$
p
=
\frac{1}{N_{\text{ciclo}}}.
$$

Assim:

$$
\boxed{
p
=
\frac{1}{
\dfrac{3W^2}{8}
+
\dfrac{3W}{4}
}
}
$$

Para $W$ grande, o termo quadrático domina:

$$
p
\approx
\frac{8}{3W^2}.
$$

Portanto:

$$
W^2
\approx
\frac{8}{3p}
$$

e:

$$
\boxed{
W
\approx
\sqrt{
\frac{8}{3p}
}
}
$$

### Throughput médio

Como:

$$
\bar W
\approx
\frac{3W}{4},
$$

temos:

$$
\text{Throughput}
\approx
\frac{3}{4}
\sqrt{
\frac{8}{3p}
}
\frac{MSS}{RTT}.
$$

Simplificando a constante:

$$
\frac{3}{4}
\sqrt{
\frac{8}{3}
}
\approx
1{,}22.
$$

Logo:

$$
\boxed{
\text{Throughput TCP}
\approx
\frac{
1{,}22\cdot MSS
}{
RTT\sqrt{p}
}
}
$$

Essa é a chamada **lei da raiz quadrada**.

Portanto:

$$
\boxed{
\text{Throughput}
\propto
\frac{1}{\sqrt{p}}
}
$$

e também:

$$
\boxed{
\text{Throughput}
\propto
\frac{1}{RTT}
}
$$

Ou seja:

- aumentar a probabilidade de perda reduz o throughput;
- aumentar o RTT reduz o throughput.

**Referência:** a descrição macroscópica está em Kurose & Ross, 8ª ed., Seção 3.7.1, p. 273. A derivação da constante $1{,}22$ aparece no Problema P47, pp. 296–297.

---

## TCP CUBIC

O TCP Reno utiliza crescimento linear durante Congestion Avoidance.

A anotação da aula introduz o **TCP CUBIC** como uma alternativa.

O CUBIC tenta retornar rapidamente para uma taxa próxima daquela existente antes da última perda.

Defina:

$$
W_{\max}
$$

como o tamanho da janela quando ocorreu a última perda.

O CUBIC define também um instante futuro:

$$
K
$$

no qual a janela deve voltar aproximadamente a $W_{\max}$, caso não aconteça outra perda.

### Ideia principal

A janela cresce de acordo com uma função cúbica da distância entre o instante atual e $K$.

Com isso:

- longe de $K$, o crescimento é mais rápido;
- próximo de $K$, o crescimento desacelera;
- depois de ultrapassar $K$, o protocolo volta a explorar de forma mais agressiva a possibilidade de existir banda adicional.

De forma qualitativa:

```text
cwnd
 ^
 |                         /
 |                    ____/
 |               ____/
 |          ____/
 |_________/______________________> tempo
            K
            |
          Wmax
```

O objetivo é passar mais tempo próximo da capacidade disponível, em vez de reduzir pela metade e retornar lentamente de forma linear.

O Kurose também observa que o TCP CUBIC é amplamente utilizado e é o TCP padrão em sistemas Linux discutidos na edição do livro.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, pp. 271–273, Figura 3.54.

---

## TCP BBR

Nas anotações aparece também:

**TCP BBR**.

A ideia registrada em aula é ajustar a taxa/janela de acordo com estimativas sobre o caminho, procurando evitar que seja necessário esperar uma perda para reagir.

Também foi anotada a relação com o **produto delay-banda**.

O produto delay-banda é:

$$
\boxed{
BDP
=
\text{bandwidth}
\times
RTT
}
$$

Ele representa aproximadamente a quantidade de dados necessária para manter o caminho cheio sem acumular uma fila desnecessariamente grande.

Assim, idealmente, busca-se uma quantidade de dados em trânsito compatível com a capacidade do caminho.

O Kurose apresenta o BBR junto aos protocolos inspirados em controle baseado em atraso e destaca a ideia de:

> manter o “pipe” cheio, mas não mais cheio do que o necessário.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.2, pp. 275–276.

---

## Comparação geral

| Mecanismo | Ideia principal |
|---|---|
| **Slow Start** | crescimento exponencial inicial |
| **AIMD / Reno** | crescimento linear e redução multiplicativa |
| **CUBIC** | crescimento cúbico em torno da janela anterior à perda |
| **BBR** | utilização de estimativas do caminho para controlar a taxa |

---

## Resumo

Os principais tópicos desta aula foram:

- continuação do controle de congestionamento;
- implementação prática no TCP;
- throughput e goodput;
- AIMD;
- **Additive Increase**;
- **Multiplicative Decrease**;
- comportamento em dente de serra;
- relação:

$$
\text{TCP rate}
\approx
\frac{cwnd}{RTT};
$$

- Slow Start;
- `ssthresh`;
- Congestion Avoidance;
- timeout e três ACKs duplicados;
- Fast Recovery;
- janela média aproximada:

$$
\bar W\approx\frac{3W}{4};
$$

- lei da raiz quadrada:

$$
\text{Throughput}
\approx
\frac{
1{,}22\cdot MSS
}{
RTT\sqrt{p}
};
$$

- TCP CUBIC;
- $W_{\max}$ e crescimento cúbico;
- TCP BBR;
- produto delay-banda.
