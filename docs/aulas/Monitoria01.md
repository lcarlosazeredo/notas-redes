# Monitoria 01 — 11/09/2026

## Comunicação entre aplicações

Considere uma comunicação HTTP entre duas extremidades:

- **emissor**: cliente HTTP;
- **receptor**: servidor HTTP.

O HTTP utiliza um protocolo da camada de transporte para realizar a comunicação entre os processos.

### TCP e UDP

O **TCP** é um protocolo de transporte orientado à conexão.

Antes da troca normal de dados, é estabelecida uma conexão entre as extremidades.

Já o **UDP** é não orientado à conexão, isto é, não realiza esse estabelecimento prévio de conexão.

---

# Modelos de fila para comutadores de pacotes

Um comutador de pacotes pode ser representado por um modelo de fila.

De forma simplificada:

\[
\text{chegadas}
\longrightarrow
\boxed{\text{fila}}
\longrightarrow
\boxed{\text{servidor}}
\longrightarrow
\text{saídas}.
\]

No contexto de redes:

- os **clientes** da fila são pacotes;
- a **fila** contém pacotes aguardando transmissão;
- o **servidor** representa o enlace de saída;
- o **serviço** corresponde à transmissão de um pacote.

Exemplos de equipamentos que podem ser analisados dessa forma:

- switches;
- hubs;
- roteadores.

---

## Taxa de chegada

Seja

\[
a
\]

a **taxa média de chegada** de pacotes.

Sua unidade é:

\[
\frac{\text{pacotes}}{\text{s}}.
\]

Também é comum utilizar a notação:

\[
\lambda=a.
\]

---

## Taxa de serviço

Seja

\[
\mu
\]

a taxa de serviço do servidor.

Se:

- $R$ é a taxa do enlace, em bits/s;
- $L$ é o tamanho médio dos pacotes, em bits;

então o tempo médio necessário para transmitir um pacote é:

\[
E[S]=\frac{L}{R}.
\]

Como:

\[
E[S]=\frac{1}{\mu},
\]

temos:

\[
\boxed{
\mu=\frac{R}{L}.
}
\]

A unidade de $\mu$ é:

\[
\frac{\text{pacotes}}{\text{s}}.
\]

---

# Objetivo da análise de filas

O objetivo de representar um comutador por um modelo de fila é obter **métricas de desempenho**.

Entre as métricas utilizadas estão:

- $\bar W$: tempo médio de espera na fila;
- $\bar N$: número médio de pacotes no sistema;
- $\bar N_q$: número médio de pacotes apenas na fila;
- $\bar T$: tempo médio total no sistema;
- $I$: intensidade de tráfego ou utilização.

O sistema inclui:

\[
\boxed{
\text{sistema}
=
\text{fila}
+
\text{servidor}.
}
\]

---

# Intensidade de tráfego

A intensidade de tráfego é:

\[
I=\frac{\lambda}{\mu}.
\]

Como:

\[
\lambda=a
\]

e:

\[
\mu=\frac{R}{L},
\]

temos:

\[
I
=
\frac{a}{R/L}.
\]

Portanto:

\[
\boxed{
I=\frac{aL}{R}.
}
\]

Também é comum utilizar:

\[
\rho=I.
\]

---

## Interpretação da utilização

A intensidade de tráfego pode ser interpretada como a fração do tempo em que o servidor permanece ocupado.

Por exemplo, se:

\[
I=0{,}5,
\]

então o servidor permanece ocupado aproximadamente:

\[
50\%
\]

do tempo.

Em equilíbrio, essa quantidade também pode ser interpretada como:

\[
\boxed{
P(\text{servidor ocupado})=I.
}
\]

Consequentemente:

\[
P(\text{servidor ocioso})=1-I.
\]

---

# Modelos de fila

Alguns modelos mencionados foram:

- $M/M/1$;
- $M/D/1$;
- $D/M/1$;
- $D/D/1$.

Na notação de Kendall:

- a primeira letra descreve o processo de chegada;
- a segunda letra descreve o tempo de serviço;
- o número indica a quantidade de servidores.

Assim:

- `M`: comportamento Markoviano, associado a tempos exponenciais;
- `D`: comportamento determinístico;
- `1`: um único servidor.

---

# Modelo M/M/1

No modelo $M/M/1$:

- as chegadas seguem um processo de Poisson;
- os tempos entre chegadas são exponenciais;
- os tempos de serviço são exponenciais;
- existe um único servidor.

Para estabilidade:

\[
I<1.
\]

---

## Número médio de pacotes no sistema

Para o modelo $M/M/1$:

\[
\boxed{
\bar N
=
\frac{I}{1-I}.
}
\]

---

## Tempo médio de espera na fila

O atraso médio na fila é:

\[
\boxed{
\bar W_{M/M/1}
=
\frac{I}{1-I}\frac{L}{R}.
}
\]

Como:

\[
\frac{L}{R}=\frac{1}{\mu},
\]

também podemos escrever:

\[
\boxed{
\bar W_{M/M/1}
=
\frac{I}{1-I}\frac{1}{\mu}.
}
\]

---

## Tempo médio total no sistema

O tempo total é a soma:

\[
\boxed{
\bar T
=
\bar W
+
\bar X,
}
\]

onde:

- $\bar W$: tempo médio aguardando na fila;
- $\bar X$: tempo médio em serviço.

Como:

\[
\bar X=\frac{L}{R},
\]

para $M/M/1$:

\[
\bar T
=
\frac{I}{1-I}\frac{L}{R}
+
\frac{L}{R}.
\]

Logo:

\[
\boxed{
\bar T_{M/M/1}
=
\frac{1}{1-I}\frac{L}{R}.
}
\]

---

# Modelo M/D/1

No modelo $M/D/1$:

- as chegadas são Poisson;
- o tempo de serviço é determinístico;
- existe um único servidor.

Como o tempo de serviço não varia, o tempo residual médio de um serviço em andamento é menor do que no caso exponencial.

O tempo médio de espera na fila é:

\[
\boxed{
\bar W_{M/D/1}
=
\frac{I}{1-I}\frac{L}{2R}.
}
\]

Portanto:

\[
\boxed{
\bar W_{M/D/1}
=
\frac{1}{2}
\bar W_{M/M/1}.
}
\]

Esse resultado mostra que, mantendo a mesma taxa média de serviço e a mesma intensidade de tráfego, reduzir a variabilidade do tempo de serviço reduz o atraso médio de fila.

---

## Número médio de pacotes no sistema no M/D/1

Pela Lei de Little:

\[
\bar N
=
\lambda\bar T.
\]

Como:

\[
\bar T
=
\bar W+\frac{L}{R},
\]

temos:

\[
\bar N_{M/D/1}
=
I
+
\frac{I^2}{2(1-I)}.
\]

Logo:

\[
\boxed{
\bar N_{M/D/1}
=
\frac{I(2-I)}{2(1-I)}.
}
\]

> **Observação:** nas anotações aparece $\bar N=I/(1-I)$ também ao lado do modelo $M/D/1$. Essa expressão é a do número médio no sistema para $M/M/1$. Para $M/D/1$, mantendo $\bar N$ como número médio no sistema, a expressão correta é a acima.

---

# M/M/1 como processo de nascimento e morte

O modelo $M/M/1$ pode ser representado como um processo de nascimento e morte:

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

onde:

- uma chegada corresponde a um **nascimento**;
- uma conclusão de serviço corresponde a uma **morte**.

Para que exista uma distribuição estacionária:

\[
\lambda<\mu,
\]

ou seja:

\[
I<1.
\]

---

# Lei de Little

A Lei de Little relaciona:

- número médio no sistema;
- taxa média de chegada;
- tempo médio no sistema.

Para o sistema completo:

\[
\boxed{
\bar N
=
\lambda\bar T.
}
\]

Para apenas a fila:

\[
\boxed{
\bar N_q
=
\lambda\bar W.
}
\]

Usando a notação das anotações:

\[
\boxed{
E[N_q]
=
a\,E[W].
}
\]

Essa relação é muito útil porque permite obter uma métrica a partir das outras duas.

---

# Três tipos de análise destacados para a prova

Nas anotações da monitoria aparecem três grupos principais de análise.

## 1. Análise de desempenho no enlace

O objetivo é estudar o comportamento da transmissão ao longo dos enlaces.

Entre os pontos mencionados estão:

- identificação dos enlaces;
- determinação do enlace gargalo;
- vazão máxima;
- técnica de **packet pair** para ajudar a identificar o gargalo.

O gargalo é o enlace cuja capacidade limita a vazão fim a fim.

De forma simplificada, para um caminho com capacidades:

\[
R_1,R_2,\ldots,R_n,
\]

a vazão máxima não pode superar:

\[
\boxed{
\min(R_1,R_2,\ldots,R_n).
}
\]

---

## 2. Análise de desempenho no comutador

Nessa análise, o foco está no comportamento do pacote dentro dos equipamentos intermediários.

### Mecanismos de transmissão

Foram destacados:

- **store-and-forward**;
- **cut-through**;
- **pipeline**.

### Modelo de filas

Também é necessário analisar métricas como:

\[
\bar N,
\qquad
I,
\qquad
\bar W.
\]

Mudanças na rede que alterem a carga ou a capacidade também afetam essas métricas.

Por exemplo:

\[
I=\frac{aL}{R}.
\]

Assim:

- aumentar $R$ reduz $I$;
- reduzir $a$ reduz $I$;
- reduzir a carga sobre um enlace pode diminuir o atraso de fila.

---

## 3. Análise probabilística

O terceiro grupo é a análise probabilística.

Entre as distribuições destacadas estão:

- distribuição Geométrica;
- distribuição Binomial.

Essas distribuições são utilizadas para modelar situações aleatórias encontradas nos problemas de redes.

---

# Distribuição Geométrica

Existem duas convenções comuns para a variável aleatória Geométrica.

## Convenção 1 — número da tentativa do primeiro sucesso

Se:

\[
Y\sim\operatorname{Geo}(p)
\]

e $Y$ representa a tentativa em que ocorre o primeiro sucesso, então:

\[
Y\in\{1,2,3,\ldots\}.
\]

Sua PMF é:

\[
\boxed{
P(Y=k)
=
(1-p)^{k-1}p,
\qquad
k\in\{1,2,3,\ldots\}.
}
\]

---

## Convenção 2 — número de fracassos antes do primeiro sucesso

Se $Y$ representa o número de fracassos antes do primeiro sucesso, então:

\[
Y\in\{0,1,2,\ldots\}.
\]

Nesse caso:

\[
\boxed{
P(Y=k)
=
(1-p)^k p,
\qquad
k\in\{0,1,2,\ldots\}.
}
\]

As duas expressões estão corretas, mas representam variáveis aleatórias ligeiramente diferentes.

Por isso, antes de utilizar a distribuição Geométrica, é importante identificar qual convenção está sendo usada no exercício.

---

# Resumo

Os principais pontos desta monitoria foram:

- cliente e servidor HTTP;
- TCP orientado à conexão e contraste com UDP;
- representação de comutadores por modelos de fila;
- taxa de chegada $a$;
- taxa de serviço $\mu=R/L$;
- intensidade de tráfego:

\[
I=\frac{aL}{R};
\]

- interpretação de $I$ como utilização;
- modelos $M/M/1$, $M/D/1$, $D/M/1$ e $D/D/1$;
- atraso médio no $M/M/1$:

\[
\bar W_{M/M/1}
=
\frac{I}{1-I}\frac{L}{R};
\]

- atraso médio no $M/D/1$:

\[
\bar W_{M/D/1}
=
\frac{I}{1-I}\frac{L}{2R};
\]

- relação:

\[
\bar W_{M/D/1}
=
\frac12\bar W_{M/M/1};
\]

- Lei de Little;
- análise de desempenho no enlace;
- análise de desempenho no comutador;
- análise probabilística;
- duas convenções para a distribuição Geométrica.
