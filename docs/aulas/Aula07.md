# Aula 07 — 02/09/2026

# Observações para o Teste

## Modelagem de situações de incerteza

Uma etapa importante na resolução de problemas probabilísticos é identificar qual variável aleatória representa adequadamente a situação de interesse.

Nesta aula foram revisadas quatro distribuições principais:

- Bernoulli;
- Binomial;
- Geométrica;
- Poisson.

---

## Distribuição de Bernoulli

Considere uma situação com apenas dois resultados possíveis, como:

- sucesso;
- fracasso.

Podemos definir

\[
Z\sim\operatorname{Ber}(p),
\]

onde

\[
P(Z=1)=p
\]

e

\[
P(Z=0)=1-p.
\]

A distribuição de Bernoulli é apropriada quando analisamos uma **única tentativa** com dois resultados possíveis.

---

## Distribuição Binomial

Considere agora $m$ tentativas independentes, cada uma com probabilidade $p$ de sucesso.

Seja

\[
X=\text{número de sucessos nas }m\text{ tentativas}.
\]

Então:

\[
\boxed{
X\sim\operatorname{Bin}(m,p)
}
\]

A função massa de probabilidade é

\[
\boxed{
P(X=k)
=
\binom{m}{k}
p^k(1-p)^{m-k},
\qquad
k=0,1,\ldots,m.
}
\]

A distribuição Binomial pode ser construída como uma soma de variáveis Bernoulli independentes:

\[
X=Z_1+Z_2+\cdots+Z_m,
\]

onde

\[
Z_i\sim\operatorname{Ber}(p).
\]

---

## Distribuição Geométrica

Considere uma sequência de tentativas independentes, cada uma com probabilidade $p$ de sucesso.

Seja

\[
Y=\text{número de tentativas até o primeiro sucesso}.
\]

Então:

\[
\boxed{
Y\sim\operatorname{Geo}(p)
}
\]

e

\[
\boxed{
P(Y=k)
=
(1-p)^{k-1}p,
\qquad
k=1,2,\ldots
}
\]

A distribuição Geométrica é utilizada quando o interesse não está no número de sucessos em uma quantidade fixa de tentativas, mas em **quanto precisamos esperar até ocorrer o primeiro sucesso**.

---

## Distribuição de Poisson

A distribuição de Poisson pode ser utilizada para contar o número de ocorrências de determinado evento em um intervalo.

Seja

\[
W=\text{número de ocorrências no intervalo}.
\]

Podemos escrever:

\[
W\sim\operatorname{Poi}(\lambda).
\]

No caso de um fluxo com taxa $\lambda$ e um intervalo de duração $T$:

\[
\boxed{
P(W=w)
=
e^{-\lambda T}
\frac{(\lambda T)^w}{w!}
}
\]

para

\[
w=0,1,2,\ldots
\]

Nesse caso,

\[
E[W]=\lambda T.
\]

---

# PMF

Para uma variável aleatória discreta, a **PMF** (*Probability Mass Function*) fornece a probabilidade de a variável assumir exatamente determinado valor.

Por exemplo, para a Binomial:

\[
P(X=k)
=
\binom{m}{k}
p^k(1-p)^{m-k}.
\]

Para a Geométrica:

\[
P(Y=k)
=
(1-p)^{k-1}p.
\]

Assim, a PMF responde perguntas do tipo:

\[
P(X=k).
\]

---

# CDF

A **CDF** (*Cumulative Distribution Function*) é definida por:

\[
\boxed{
F_X(k)=P(X\leq k).
}
\]

Para uma variável aleatória discreta:

\[
F_X(k)
=
\sum_{i\leq k}P(X=i).
\]

A CDF acumula as probabilidades até determinado valor.

---

## Cálculo de probabilidades de cauda

Suponha:

\[
X\sim\operatorname{Bin}(m,p).
\]

Para calcular:

\[
P(X>k),
\]

podemos utilizar duas formas.

### Soma direta das PMFs

Como queremos valores estritamente maiores que $k$:

\[
\boxed{
P(X>k)
=
\sum_{i=k+1}^{m}
\binom{m}{i}
p^i(1-p)^{m-i}.
}
\]

### Usando a CDF

Como

\[
F_X(k)=P(X\leq k),
\]

temos:

\[
\boxed{
P(X>k)=1-F_X(k).
}
\]

---

## Caso $P(X\geq k)$

É importante distinguir:

\[
X>k
\]

de

\[
X\geq k.
\]

Nesse segundo caso:

\[
P(X\geq k)
=
\sum_{i=k}^{m}
P(X=i),
\]

e, usando a CDF:

\[
\boxed{
P(X\geq k)
=
1-F_X(k-1).
}
\]

---

# Relações entre distribuições

As distribuições vistas não são conceitos isolados.

## Bernoulli para Binomial

Se

\[
Z_1,\ldots,Z_m
\]

são Bernoulli independentes com parâmetro $p$, então:

\[
\boxed{
X=\sum_{i=1}^{m}Z_i
\sim
\operatorname{Bin}(m,p).
}
\]

---

## Binomial para Poisson

Considere:

\[
X\sim\operatorname{Bin}(m,p).
\]

Quando o número de tentativas é grande e a probabilidade individual de sucesso é pequena, mantendo

\[
mp=\lambda,
\]

a distribuição Binomial pode ser aproximada por uma Poisson:

\[
\boxed{
\operatorname{Bin}(m,p)
\longrightarrow
\operatorname{Poi}(\lambda).
}
\]

Essa aproximação já havia sido derivada na aula anterior.

---

## Binomial para Gaussiana

Também foi indicada em aula a aproximação da distribuição Binomial por uma distribuição Gaussiana quando o número de tentativas é grande.

De maneira conceitual:

\[
\operatorname{Bin}(m,p)
\longrightarrow
\text{Gaussiana}
\qquad
(m\text{ grande}).
\]

> **Observação:** as condições e os detalhes dessa aproximação não foram
> desenvolvidos nas anotações desta aula.

---

# Revisão — Modelo de Filas

Considere uma fila com:

- taxa de chegada $\lambda$;
- taxa de serviço $\mu$;
- um único servidor.

De maneira simplificada:

\[
\boxed{
\text{chegadas}
\xrightarrow{\lambda}
\text{fila}
\longrightarrow
\text{servidor}
\xrightarrow{\mu}
\text{saídas}
}
\]

A intensidade de tráfego é:

\[
\boxed{
I=\frac{\lambda}{\mu}.
}
\]

No contexto dos pacotes de rede:

\[
\lambda=a
\]

e

\[
\mu=\frac{R}{L}.
\]

Portanto:

\[
\boxed{
I
=
\frac{La}{R}
=
\frac{\lambda}{\mu}.
}
\]

---

## Comportamento em função de $I$

Para que a fila permaneça estável:

\[
I<1.
\]

Quando

\[
I\rightarrow1,
\]

a utilização do servidor se aproxima de $100\%$ e o número médio de pacotes e o atraso médio crescem rapidamente.

> **[Inserir figura]** Gráfico feito em sala mostrando o crescimento
> de $\bar N$ quando $I$ se aproxima de $1$.

---

# Fluxo de Poisson

No modelo considerado, as chegadas são representadas por um **processo de Poisson**.

Se a taxa de chegada é $\lambda$, então o número de chegadas em um intervalo de duração $T$ possui distribuição:

\[
\boxed{
W\sim\operatorname{Poi}(\lambda T).
}
\]

Logo:

\[
\boxed{
P(W=w)
=
e^{-\lambda T}
\frac{(\lambda T)^w}{w!}.
}
\]

Podemos observar esse processo de duas maneiras diferentes:

1. contando **quantas chegadas** ocorrem em um intervalo;
2. observando o **tempo entre chegadas consecutivas**.

---

## Número de chegadas

O número de chegadas em um intervalo é uma variável aleatória **discreta**.

\[
W\sim\operatorname{Poi}(\lambda T).
\]

---

## Tempo entre chegadas

O tempo entre duas chegadas consecutivas é uma variável aleatória **contínua**.

Para um processo de Poisson, esse tempo possui distribuição Exponencial.

Seja:

\[
X=\text{tempo entre chegadas}.
\]

Então:

\[
\boxed{
X\sim\operatorname{Exp}(\lambda).
}
\]

e

\[
P(X>t)=e^{-\lambda t}.
\]

Assim, existe uma relação fundamental:

\[
\boxed{
\text{Processo de Poisson}
\Longleftrightarrow
\begin{cases}
\text{número de chegadas: Poisson},\\
\text{tempo entre chegadas: Exponencial}.
\end{cases}
}
\]

---

# Distribuição Exponencial e falta de memória

A distribuição Exponencial possui a propriedade de **falta de memória**:

\[
\boxed{
P(X>s+t\mid X>s)=P(X>t).
}
\]

Isso significa que, condicionado ao fato de que já esperamos durante um tempo $s$, o tempo adicional de espera possui a mesma distribuição que havia originalmente.

Essa propriedade será importante no modelo de filas.

---

# Hipóteses utilizadas no modelo de filas

A derivação apresentada nas aulas anteriores depende de hipóteses sobre o comportamento das chegadas e do serviço.

As duas propriedades destacadas nesta aula foram:

1. **PASTA**;
2. **falta de memória do tempo de serviço**.

---

## PASTA

PASTA significa:

**Poisson Arrivals See Time Averages.**

A ideia é que, quando as chegadas seguem um processo de Poisson, um pacote que chega ao sistema encontra, em média, o mesmo estado observado por alguém que olha o sistema em um instante aleatório.

Assim, o número médio de pacotes que uma chegada encontra pode ser representado pelas médias temporais do sistema.

Essa propriedade permite utilizar quantidades como:

\[
\bar N_q
\]

e

\[
\bar N_s
\]

ao calcular o tempo médio experimentado por um pacote que acabou de chegar.

---

## Falta de memória no servidor

Assumindo tempos de serviço exponenciais, o tempo restante de serviço de um pacote que já está sendo transmitido possui a mesma distribuição do tempo original de serviço.

Assim, se:

\[
\bar S
=
E[S]
\]

é o tempo médio de serviço, o tempo médio restante de serviço observado por uma chegada também é $\bar S$.

Isso decorre da propriedade de falta de memória da distribuição Exponencial.

---

# Derivação do atraso médio de fila

Defina:

- $\bar N_q$: número médio de pacotes na fila;
- $\bar N_s$: número médio de pacotes no servidor;
- $\bar S$: tempo médio de serviço;
- $\bar W$: tempo médio de espera na fila.

Um pacote que chega precisa esperar:

1. os pacotes que já estão na fila;
2. o eventual pacote que está sendo atendido.

Portanto:

\[
\boxed{
\bar W
=
(\bar N_q+\bar N_s)\bar S.
}
\]

Como o servidor está ocupado uma fração $I$ do tempo:

\[
\boxed{
\bar N_s=I.
}
\]

Pela Lei de Little aplicada à fila:

\[
\boxed{
\bar N_q=\lambda\bar W.
}
\]

Assim:

\[
\bar W
=
(\lambda\bar W+I)\bar S.
\]

Distribuindo:

\[
\bar W
=
\lambda\bar W\bar S
+
I\bar S.
\]

Como:

\[
\lambda\bar S=I,
\]

temos:

\[
\bar W
=
I\bar W
+
I\bar S.
\]

Logo:

\[
(1-I)\bar W
=
I\bar S.
\]

Portanto:

\[
\boxed{
\bar W
=
\frac{I\bar S}{1-I}.
}
\]

---

# Número médio de pacotes

Pela Lei de Little aplicada à fila:

\[
\bar N_q=\lambda\bar W.
\]

Substituindo a expressão de $\bar W$:

\[
\bar N_q
=
\lambda
\frac{I\bar S}{1-I}.
\]

Como:

\[
\lambda\bar S=I,
\]

obtemos:

\[
\boxed{
\bar N_q
=
\frac{I^2}{1-I}.
}
\]

O número médio de pacotes no servidor é:

\[
\bar N_s=I.
\]

Portanto, o número médio total de pacotes no sistema é:

\[
\bar N
=
\bar N_q+\bar N_s.
\]

Logo:

\[
\bar N
=
\frac{I^2}{1-I}+I.
\]

Assim:

\[
\boxed{
\bar N
=
\frac{I}{1-I}.
}
\]

---

# Relações principais do modelo

Para o modelo analisado:

\[
\boxed{
I=\frac{\lambda}{\mu}
}
\]

\[
\boxed{
\bar N_s=I
}
\]

\[
\boxed{
\bar W
=
\frac{I\bar S}{1-I}
}
\]

\[
\boxed{
\bar N_q
=
\frac{I^2}{1-I}
}
\]

\[
\boxed{
\bar N
=
\frac{I}{1-I}
}
\]

com a Lei de Little:

\[
\boxed{
\bar N=\lambda\bar T.
}
\]

---

# Modelo M/M/1

As hipóteses utilizadas nesta análise correspondem ao modelo de fila conhecido como **M/M/1**:

- primeiro **M**: chegadas Markovianas, representadas por um processo de Poisson;
- segundo **M**: tempos de serviço exponenciais;
- **1**: existe um único servidor.

Essas hipóteses explicam por que aparecem conjuntamente:

- chegadas Poisson;
- tempos entre chegadas exponenciais;
- tempos de serviço exponenciais;
- propriedade de falta de memória;
- propriedade PASTA.

> **Observação:** a notação M/M/1 não aparece de forma claramente
> legível nas anotações, mas é o modelo correspondente às hipóteses
> explicitamente trabalhadas nesta aula.