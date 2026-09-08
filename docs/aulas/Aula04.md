# Aula 04 — 21/08/2026

# Packet Switching e Circuit Switching

## Comparação entre Packet Switching e Circuit Switching

Uma diferença fundamental entre **packet switching** e **circuit switching** está na forma como os recursos da rede são compartilhados.

| Característica | Packet Switching | Circuit Switching |
|---|---|---|
| Filas | Pode haver filas | Não há fila associada à disputa pelo recurso reservado |
| Garantia | Probabilística | Determinística, condicionada à aceitação/bloqueio |
| Compartilhamento de recursos | Uso de recursos de acordo com a demanda | Recursos reservados |
| Multiplexação | Compartilhamento estatístico | Reserva prévia |
| Recursos | Capacidade/fila do roteador | Circuito reservado |

No **packet switching**, os recursos são utilizados conforme os usuários necessitam deles.

No **circuit switching**, uma parcela dos recursos é reservada para cada conexão aceita.

---

## Compartilhamento estatístico

No packet switching, os usuários não precisam utilizar simultaneamente toda a capacidade que poderiam demandar.

Isso permite realizar **compartilhamento estatístico** dos recursos.

A ideia central é:

> mesmo que existam muitos usuários conectados à rede, apenas uma parcela deles estará ativa simultaneamente.

Por isso, pode ser possível atender a um número de usuários maior do que seria possível se os recursos fossem permanentemente reservados para todos eles.

---

# Problema dos usuários ativos

Considere:

- $p$: probabilidade de um usuário estar ativo;
- $n$: número de recursos disponíveis;
- $m$: número total de usuários.

O problema de interesse ocorre quando:

\[
m>n,
\]

pois existem mais usuários do que recursos capazes de atendê-los simultaneamente.

Entretanto, se cada usuário estiver ativo apenas com probabilidade $p$, pode ser improvável que mais de $n$ usuários estejam ativos ao mesmo tempo.

---

## Exemplo

Considere um enlace de:

\[
1\text{ Gbit/s}.
\]

Suponha que cada usuário necessite de:

\[
100\text{ Mbit/s}
\]

quando está ativo e que esteja ativo em aproximadamente $10\%$ do tempo.

Se utilizássemos circuit switching e reservássemos $100$ Mbit/s permanentemente para cada usuário, seria possível atender simultaneamente apenas:

\[
\frac{1\text{ Gbit/s}}{100\text{ Mbit/s}}
=
10
\]

usuários.

No packet switching, entretanto, podemos admitir mais de 10 usuários, pois é pouco provável que todos estejam ativos simultaneamente.

O problema passa a ser probabilístico:

> Qual é a probabilidade de haver mais usuários ativos do que a capacidade do enlace consegue atender?

---

# Variável aleatória de interesse

Defina:

\[
A=\text{número de usuários ativos}.
\]

Se existem $m$ usuários e cada um está ativo independentemente com probabilidade $p$, então:

\[
\boxed{
A\sim\operatorname{Binomial}(m,p)
}
\]

e

\[
P(A=a)
=
\binom{m}{a}
p^a(1-p)^{m-a}.
\]

---

## Probabilidade de nenhum usuário estar ativo

Para $A=0$:

\[
P(A=0)
=
\binom{m}{0}p^0(1-p)^m.
\]

Portanto,

\[
\boxed{
P(A=0)=(1-p)^m
}
\]

---

## Probabilidade de exatamente um usuário estar ativo

Para $A=1$:

\[
P(A=1)
=
\binom{m}{1}p(1-p)^{m-1}.
\]

Como

\[
\binom{m}{1}=m,
\]

temos:

\[
\boxed{
P(A=1)
=
mp(1-p)^{m-1}
}
\]

Esse resultado também pode ser entendido somando os $m$ casos possíveis em que exatamente um dos usuários está ativo.

---

## Probabilidade de exatamente $a$ usuários estarem ativos

De maneira geral:

\[
\boxed{
P(A=a)
=
\binom{m}{a}
p^a(1-p)^{m-a}
}
\]

O coeficiente

\[
\binom{m}{a}
\]

conta quantas escolhas diferentes de $a$ usuários ativos podem ser feitas entre os $m$ usuários.

---

# Probabilidade de sobrecarga

Suponha que o sistema consiga atender simultaneamente até $n$ usuários.

Há sobrecarga quando:

\[
A>n.
\]

Portanto:

\[
P(A>n)
=
\sum_{a=n+1}^{m}P(A=a).
\]

Equivalentemente, utilizando o evento complementar:

\[
\boxed{
P(A>n)
=
1-\sum_{a=0}^{n}P(A=a)
}
\]

ou:

\[
\boxed{
P(A>n)
=
1-
\sum_{a=0}^{n}
\binom{m}{a}
p^a(1-p)^{m-a}
}
\]

A escolha do número de usuários $m$ pode ser feita de modo que essa probabilidade permaneça suficientemente pequena.

Por exemplo, pode-se impor uma condição como:

\[
P(A>n)\leq \varepsilon,
\]

onde $\varepsilon$ representa uma pequena probabilidade de sobrecarga tolerada pelo sistema.

---

## Interpretação

Essa análise mostra por que o **packet switching** permite compartilhar os recursos entre um número maior de usuários.

No circuit switching, os recursos são reservados considerando a demanda máxima de cada usuário.

No packet switching, utiliza-se o fato de que:

\[
\text{nem todos os usuários estarão ativos simultaneamente}.
\]

Assim, é possível admitir:

\[
m>n,
\]

desde que a probabilidade

\[
P(A>n)
\]

seja suficientemente pequena.

Esse é o princípio do **compartilhamento estatístico**.

---

# Binomial e aproximação de Poisson

Considere novamente:

\[
A\sim\operatorname{Binomial}(m,p).
\]

A esperança de $A$ é:

\[
E[A]=mp.
\]

Definindo:

\[
\lambda=mp,
\]

temos:

\[
p=\frac{\lambda}{m}.
\]

A probabilidade binomial pode então ser escrita como:

\[
P(A=a)
=
\binom{m}{a}
\left(\frac{\lambda}{m}\right)^a
\left(1-\frac{\lambda}{m}\right)^{m-a}.
\]

---

## Aproximação para $m$ grande

Expandindo o coeficiente binomial:

\[
P(A=a)
=
\frac{m(m-1)(m-2)\cdots(m-a+1)}{a!}
\left(\frac{\lambda}{m}\right)^a
\left(1-\frac{\lambda}{m}\right)^{m-a}.
\]

Quando $m$ é grande e $a$ permanece relativamente pequeno em comparação com $m$,

\[
\frac{m(m-1)\cdots(m-a+1)}{m^a}
\approx 1.
\]

Além disso,

\[
\left(1-\frac{\lambda}{m}\right)^m
\longrightarrow
e^{-\lambda}.
\]

Portanto,

\[
P(A=a)
\approx
e^{-\lambda}\frac{\lambda^a}{a!}.
\]

Logo, para $m$ grande e $p$ pequeno, mantendo

\[
mp=\lambda,
\]

a distribuição binomial pode ser aproximada por uma distribuição de Poisson:

\[
\boxed{
A\approx\operatorname{Poisson}(\lambda)
}
\]

com

\[
\boxed{
P(A=a)
\approx
e^{-\lambda}\frac{\lambda^a}{a!}
}
\]

---

## Interpretação da aproximação

A aproximação de Poisson é particularmente útil quando temos:

- um número $m$ grande de usuários;
- uma probabilidade individual $p$ pequena de cada usuário estar ativo;
- um número médio de usuários ativos

\[
\lambda=mp
\]

de magnitude moderada.

Isso simplifica o cálculo das probabilidades relacionadas ao número de usuários ativos.

---

# Formas de caracterizar uma variável aleatória

Uma variável aleatória pode ser caracterizada de diferentes maneiras.

Foram destacadas quatro formas.

## 1. PMF / PDF

Para uma variável aleatória discreta, podemos utilizar sua **função massa de probabilidade (PMF)**:

\[
p_X(x)=P(X=x).
\]

Ela associa a cada possível valor da variável aleatória a probabilidade correspondente.

> **[Inserir figura]** Gráfico discreto desenhado em sala representando
> as probabilidades associadas aos possíveis valores da variável aleatória.

Para variáveis aleatórias contínuas, utiliza-se uma **função densidade de probabilidade (PDF)**.

---

## 2. CDF

Outra forma de caracterizar uma variável aleatória é através de sua **função distribuição acumulada (CDF)**:

\[
\boxed{
F_X(x)=P(X\leq x)
}
\]

Para uma variável discreta:

\[
F_X(x)
=
\sum_{k\leq x}P(X=k).
\]

A CDF acumula as probabilidades à medida que $x$ aumenta.

> **[Inserir figura]** Gráfico em degraus da CDF desenhado em sala.

---

## 3. Momentos

Uma variável aleatória também pode ser caracterizada através de seus **momentos**.

Alguns exemplos são:

\[
E[X],
\qquad
E[X^2],
\qquad
E[X^n].
\]

Essas quantidades fornecem informações sobre diferentes características da distribuição.

Por exemplo, o primeiro momento é:

\[
E[X],
\]

isto é, a esperança da variável aleatória.

---

## 4. Transformadas

Outra forma mencionada para caracterizar uma variável aleatória é através de **transformadas**.

As transformadas permitem representar informações sobre a distribuição de uma variável aleatória de outra forma matemática.

> **Observação:** as anotações apenas introduzem esse tópico, sem desenvolver nesta aula qual transformada será utilizada.