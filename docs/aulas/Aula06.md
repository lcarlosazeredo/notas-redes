# Aula 06 — 28/08/2026

# Teoria de Filas — Continuação

## Intensidade de tráfego

Considere um enlace no qual:

- $L$: tamanho médio dos pacotes, em bits;
- $a$: taxa média de chegada de pacotes, em pacotes/s;
- $R$: capacidade de transmissão do enlace, em bits/s.

A intensidade de tráfego é

\[
\boxed{
I=\frac{La}{R}
}
\]

A taxa de serviço do enlace, medida em pacotes por segundo, é

\[
\mu=\frac{R}{L}.
\]

Se identificarmos a taxa de chegada por

\[
\lambda=a,
\]

então

\[
I
=
\frac{La}{R}
=
\frac{a}{R/L}
=
\frac{\lambda}{\mu}.
\]

Portanto,

\[
\boxed{
I=\frac{\lambda}{\mu}
}
\]

---

## Interpretação da utilização

A intensidade de tráfego também pode ser interpretada como a **utilização do servidor**.

O servidor pode estar:

- **ocupado**, transmitindo um pacote;
- **ocioso**, sem pacote para transmitir.

Assim,

\[
P(\text{ocupado})+P(\text{ocioso})=1.
\]

Quando o servidor está ocupado, ele transmite pacotes com taxa $\mu$.

Quando está ocioso, sua taxa de saída é zero.

A taxa média de saída é, portanto,

\[
E[\text{taxa de saída}]
=
E[\text{taxa de saída}\mid\text{ocupado}]P(\text{ocupado})
+
E[\text{taxa de saída}\mid\text{ocioso}]P(\text{ocioso}).
\]

Substituindo:

\[
E[\text{taxa de saída}]
=
\mu P(\text{ocupado})
+
0\cdot P(\text{ocioso}).
\]

Em equilíbrio, a taxa média de entrada é igual à taxa média de saída:

\[
\lambda
=
\mu P(\text{ocupado}).
\]

Logo,

\[
P(\text{ocupado})
=
\frac{\lambda}{\mu}.
\]

Como

\[
I=\frac{\lambda}{\mu},
\]

temos

\[
\boxed{
P(\text{ocupado})=I
}
\]

e, consequentemente,

\[
\boxed{
P(\text{ocioso})=1-I.
}
\]

Assim, a intensidade de tráfego também representa a fração de tempo durante a qual o servidor está ocupado.

---

## Estabilidade da fila

Para que o sistema permaneça estável, precisamos de

\[
\lambda<\mu,
\]

ou, equivalentemente,

\[
\boxed{
I<1.
}
\]

Se

\[
I\rightarrow1,
\]

a taxa de chegada se aproxima da capacidade de serviço.

Nesse caso, filas grandes tornam-se cada vez mais prováveis e o atraso médio cresce rapidamente.

Se

\[
I>1,
\]

a taxa média de chegada é maior que a taxa máxima de atendimento. Em uma fila com capacidade ilimitada, o número de pacotes acumulados cresce indefinidamente.

> **[Inserir figura]** Gráfico feito em sala mostrando o crescimento
> acentuado do atraso quando $I$ se aproxima de $1$.

---

# Modelo de fila

Considere uma fila com um único servidor.

Os pacotes chegam com taxa

\[
\lambda
\]

e são atendidos com taxa

\[
\mu.
\]

O número de pacotes presentes no sistema pode ser representado pelos estados

\[
0,1,2,3,\ldots
\]

com transições:

\[
0
\xrightleftharpoons[\mu]{\lambda}
1
\xrightleftharpoons[\mu]{\lambda}
2
\xrightleftharpoons[\mu]{\lambda}
3
\xrightleftharpoons[\mu]{\lambda}
\cdots
\]

Uma chegada aumenta o número de pacotes no sistema em uma unidade:

\[
n\rightarrow n+1,
\]

enquanto a conclusão de um serviço reduz esse número:

\[
n\rightarrow n-1.
\]

> **[Inserir figura]** Cadeia de estados desenhada em sala,
> com transições de chegada $\lambda$ e de serviço $\mu$.

O modelo representado é o de uma fila de um único servidor com chegadas e serviços aleatórios.

---

# Lei de Little

Sejam:

- $\bar N$: número médio de clientes no sistema;
- $\lambda$: taxa média de chegada;
- $\bar T$: tempo médio de permanência de um cliente no sistema.

A **Lei de Little** afirma que

\[
\boxed{
\bar N=\lambda\bar T.
}
\]

Ou seja,

\[
\text{número médio no sistema}
=
\text{taxa média de chegada}
\times
\text{tempo médio no sistema}.
\]

---

## Interpretação das unidades

Temos

\[
\lambda
=
\frac{\text{clientes}}{\text{unidade de tempo}}
\]

e

\[
\bar T
=
\frac{\text{tempo}}{\text{cliente}}.
\]

Portanto,

\[
\lambda\bar T
\]

possui unidade de clientes, como esperado para $\bar N$.

---

# Interpretação da Lei de Little

A aula apresenta duas formas equivalentes de observar o mesmo sistema.

## Visão 1 — pagamento ao sair

Imagine que cada cliente pague, ao deixar o sistema, um valor proporcional ao tempo em que permaneceu nele.

Se aproximadamente

\[
\lambda T
\]

clientes saem durante um intervalo longo de duração $T$, e cada cliente permanece no sistema em média durante $\bar T$, então o valor total acumulado é aproximadamente

\[
\lambda T\bar T.
\]

Dividindo pelo tempo total observado:

\[
\frac{\lambda T\bar T}{T}
=
\lambda\bar T.
\]

---

## Visão 2 — pagamento contínuo

Agora imagine que cada cliente presente no sistema pague continuamente enquanto estiver nele.

Se existem, em média,

\[
\bar N
\]

clientes presentes, então durante um intervalo $T$ o valor acumulado é aproximadamente

\[
\bar N T.
\]

As duas formas contabilizam exatamente a mesma quantidade.

Assim,

\[
\bar N T
=
\lambda T\bar T.
\]

Cancelando $T$:

\[
\boxed{
\bar N=\lambda\bar T.
}
\]

Essa é uma interpretação intuitiva da Lei de Little.

---

## Interpretação geométrica

Outra maneira de visualizar a Lei de Little é representar o número de clientes presentes no sistema em função do tempo.

Cada cliente pode ser representado por um intervalo horizontal correspondente ao período entre:

- sua chegada;
- sua saída.

A soma dos comprimentos desses intervalos representa o tempo total acumulado de permanência dos clientes.

Por outro lado, olhando verticalmente o gráfico, obtemos quantos clientes estavam presentes em cada instante.

As duas formas calculam a mesma área.

Assim:

\[
\boxed{
\text{área}
=
\text{número de clientes}
\times
\text{tempo}
}
\]

e, ao tomar médias em um intervalo suficientemente longo, obtemos novamente

\[
\bar N=\lambda\bar T.
\]

> **[Inserir figura]** Representação feita em sala dos intervalos
> de permanência dos clientes e do número de clientes presentes
> ao longo do tempo.

---

# Fila e servidor

É importante separar o sistema em duas partes:

\[
\boxed{
\text{sistema}
=
\text{fila de espera}
+
\text{servidor}.
}
\]

Defina:

- $\bar N_q$: número médio de pacotes aguardando na fila;
- $\bar N_s$: número médio de pacotes no servidor;
- $\bar N$: número médio total de pacotes no sistema.

Então:

\[
\boxed{
\bar N=\bar N_q+\bar N_s.
}
\]

Como o servidor comporta no máximo um pacote e permanece ocupado uma fração $I$ do tempo,

\[
\boxed{
\bar N_s=I.
}
\]

Logo,

\[
\boxed{
\bar N=\bar N_q+I.
}
\]

---

# Tempos no sistema

Defina:

- $\bar W$: tempo médio de espera na fila;
- $\bar X$: tempo médio de serviço;
- $\bar T$: tempo médio total de permanência no sistema.

Temos:

\[
\boxed{
\bar T=\bar W+\bar X.
}
\]

Como a taxa de serviço é $\mu$,

\[
\boxed{
\bar X=\frac{1}{\mu}.
}
\]

Como

\[
\mu=\frac{R}{L},
\]

também podemos escrever

\[
\boxed{
\bar X=\frac{L}{R}.
}
\]

Assim, $\bar X$ corresponde ao atraso médio de transmissão de um pacote.

---

# Lei de Little aplicada à fila

Aplicando a Lei de Little somente à fila de espera:

\[
\boxed{
\bar N_q=\lambda\bar W.
}
\]

Aplicando ao sistema completo:

\[
\boxed{
\bar N=\lambda\bar T.
}
\]

Como

\[
\bar T=\bar W+\bar X,
\]

temos

\[
\bar N
=
\lambda(\bar W+\bar X).
\]

Portanto,

\[
\bar N
=
\lambda\bar W+\lambda\bar X.
\]

Usando

\[
\bar N_q=\lambda\bar W
\]

e

\[
\lambda\bar X
=
\frac{\lambda}{\mu}
=
I,
\]

obtemos novamente:

\[
\boxed{
\bar N=\bar N_q+I.
}
\]

---

# Derivação do atraso médio de fila

No modelo considerado em aula, um pacote que chega precisa esperar pelos pacotes que já estão na fila e, caso o servidor esteja ocupado, pelo pacote que está sendo transmitido.

O número médio de pacotes que precisam ser atendidos antes dele é

\[
\bar N_q+\bar N_s.
\]

Como

\[
\bar N_s=I,
\]

temos

\[
\bar W
=
(\bar N_q+I)\bar X.
\]

Pela Lei de Little:

\[
\bar N_q=\lambda\bar W.
\]

Logo,

\[
\bar W
=
(\lambda\bar W+I)\bar X.
\]

Distribuindo:

\[
\bar W
=
\lambda\bar W\bar X
+
I\bar X.
\]

Mas

\[
\lambda\bar X
=
\frac{\lambda}{\mu}
=
I.
\]

Portanto:

\[
\bar W
=
I\bar W
+
I\bar X.
\]

Assim,

\[
(1-I)\bar W
=
I\bar X.
\]

Finalmente:

\[
\boxed{
\bar W
=
\frac{I\bar X}{1-I}.
}
\]

Como

\[
\bar X=\frac{L}{R},
\]

também podemos escrever

\[
\boxed{
\bar W
=
\frac{I}{1-I}\frac{L}{R}.
}
\]

---

# Número médio de pacotes na fila

Pela Lei de Little,

\[
\bar N_q
=
\lambda\bar W.
\]

Substituindo

\[
\bar W
=
\frac{I\bar X}{1-I},
\]

temos:

\[
\bar N_q
=
\lambda
\frac{I\bar X}{1-I}.
\]

Como

\[
\lambda\bar X=I,
\]

segue que

\[
\boxed{
\bar N_q
=
\frac{I^2}{1-I}.
}
\]

---

# Número médio de pacotes no sistema

Sabemos que

\[
\bar N
=
\bar N_q+\bar N_s.
\]

Como

\[
\bar N_s=I,
\]

temos

\[
\bar N
=
\frac{I^2}{1-I}
+
I.
\]

Colocando no mesmo denominador:

\[
\bar N
=
\frac{I^2+I(1-I)}{1-I}.
\]

Logo,

\[
\bar N
=
\frac{I^2+I-I^2}{1-I}.
\]

Portanto:

\[
\boxed{
\bar N
=
\frac{I}{1-I}.
}
\]

---

# Tempo médio no sistema

Pela Lei de Little,

\[
\bar N=\lambda\bar T.
\]

Assim,

\[
\bar T
=
\frac{\bar N}{\lambda}.
\]

Substituindo

\[
\bar N=\frac{I}{1-I},
\]

temos:

\[
\bar T
=
\frac{I}{\lambda(1-I)}.
\]

Como

\[
I=\frac{\lambda}{\mu},
\]

segue que

\[
\boxed{
\bar T
=
\frac{1}{\mu-\lambda}.
}
\]

Equivalentemente,

\[
\boxed{
\bar T
=
\frac{\bar X}{1-I}.
}
\]

---

# Resumo das relações

Para o modelo de fila analisado:

\[
\boxed{
I=\frac{\lambda}{\mu}=\frac{La}{R}
}
\]

\[
\boxed{
P(\text{ocupado})=I
}
\]

\[
\boxed{
P(\text{ocioso})=1-I
}
\]

\[
\boxed{
\bar X=\frac{1}{\mu}=\frac{L}{R}
}
\]

\[
\boxed{
\bar N_s=I
}
\]

\[
\boxed{
\bar W=\frac{I\bar X}{1-I}
}
\]

\[
\boxed{
\bar N_q=\frac{I^2}{1-I}
}
\]

\[
\boxed{
\bar N=\frac{I}{1-I}
}
\]

\[
\boxed{
\bar T=\frac{\bar X}{1-I}
}
\]

e, pela Lei de Little,

\[
\boxed{
\bar N=\lambda\bar T.
}
\]

Quando

\[
I\rightarrow1,
\]

tanto

\[
\bar N
\]

quanto

\[
\bar W
\quad\text{e}\quad
\bar T
\]

crescem rapidamente.

Isso explica matematicamente o comportamento do gráfico de atraso em função da intensidade de tráfego.