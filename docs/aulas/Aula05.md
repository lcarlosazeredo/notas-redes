# Aula 05 — 26/08/2026

# Teoria de Filas e Atrasos em Redes

## Distribuição Geométrica

Considere uma sequência de tentativas independentes, em que cada tentativa pode resultar em:

- sucesso, com probabilidade $q$;
- fracasso, com probabilidade $1-q$.

Seja $S$ o número de tentativas necessárias até ocorrer o primeiro sucesso.

Podemos representar os possíveis eventos como:

\[
S_1,\quad S_2,\quad S_3,\ldots
\]

onde $S_i$ representa a ocorrência do primeiro sucesso na tentativa $i$.

Assim,

\[
S \sim \operatorname{Geom}(q).
\]

---

## Esperança da Geométrica

Podemos obter $E[S]$ utilizando uma relação recursiva.

Na primeira tentativa:

- com probabilidade $q$, ocorre sucesso e são necessárias apenas $1$ tentativa;
- com probabilidade $1-q$, ocorre fracasso, gastamos uma tentativa e o problema recomeça nas mesmas condições.

Portanto,

\[
E[S]
=
q\cdot 1
+
(1-q)\left(1+E[S]\right).
\]

Definindo

\[
\mu=E[S],
\]

temos:

\[
\mu
=
q+(1-q)(1+\mu).
\]

Expandindo:

\[
\mu
=
q+1-q+(1-q)\mu,
\]

logo,

\[
\mu
=
1+(1-q)\mu.
\]

Passando o termo para o primeiro membro:

\[
q\mu=1.
\]

Portanto,

\[
\boxed{
E[S]=\frac{1}{q}
}
\]

Esse resultado também decorre da propriedade de **falta de memória** da distribuição geométrica: após um fracasso, o problema probabilístico restante é equivalente ao problema inicial.

---

# Garantias em Redes

Uma questão importante na comparação entre diferentes formas de compartilhamento de recursos é:

> O que significa oferecer garantias?

No **circuit switching**, existe reserva prévia de recursos. Uma vez que o circuito é aceito e estabelecido, há uma quantidade de recursos destinada àquela comunicação.

No **packet switching**, por outro lado, os usuários compartilham dinamicamente os recursos da rede. Assim, o número de usuários ativos pode variar aleatoriamente.

Seja:

\[
A=\text{número de usuários ativos}.
\]

Uma possível condição de projeto é escolher a capacidade de forma que:

\[
P(A>n)
\]

seja suficientemente pequena, onde $n$ representa o número máximo de usuários que podem ser atendidos simultaneamente.

Portanto, no packet switching, uma garantia pode ser expressa de maneira **probabilística**, por exemplo:

\[
P(A>n)\leq \varepsilon,
\]

para algum $\varepsilon$ pequeno.

---

# Componentes do Atraso

O atraso total experimentado por um pacote em um nó da rede pode ser decomposto em diferentes componentes:

\[
\boxed{
d_{\text{nodal}}
=
d_{\text{proc}}
+
d_{\text{fila}}
+
d_{\text{trans}}
+
d_{\text{prop}}
}
\]

onde:

- $d_{\text{proc}}$: atraso de processamento;
- $d_{\text{fila}}$: atraso de fila;
- $d_{\text{trans}}$: atraso de transmissão;
- $d_{\text{prop}}$: atraso de propagação.

---

## Atraso de Processamento

O **atraso de processamento** corresponde ao tempo utilizado pelo equipamento para processar o pacote.

Entre as operações realizadas podem estar:

- examinar informações do cabeçalho;
- determinar para onde o pacote deve ser encaminhado;
- verificar possíveis erros.

Esse atraso é representado por:

\[
d_{\text{proc}}.
\]

---

## Atraso de Fila

Depois de processado, o pacote pode precisar aguardar antes de ser transmitido.

Esse tempo é o **atraso de fila**:

\[
d_{\text{fila}}.
\]

Ele depende do estado da fila no instante em que o pacote chega e, portanto, pode variar de pacote para pacote.

---

## Atraso de Transmissão

Considere:

- $L$: tamanho do pacote, em bits;
- $R$: taxa de transmissão do enlace, em bits/s.

O atraso necessário para colocar todos os bits do pacote no enlace é:

\[
\boxed{
d_{\text{trans}}=\frac{L}{R}
}
\]

---

## Atraso de Propagação

Considere:

- $D$: distância do enlace;
- $v_{\text{prop}}$: velocidade de propagação do sinal.

O atraso de propagação é:

\[
\boxed{
d_{\text{prop}}
=
\frac{D}{v_{\text{prop}}}
}
\]

É importante distinguir transmissão de propagação:

- **transmissão:** tempo necessário para colocar os bits no meio;
- **propagação:** tempo necessário para os bits percorrerem o meio.

---

# Analogia da Caravana

Para diferenciar atraso de transmissão e atraso de propagação, podemos utilizar a analogia de uma **caravana** atravessando um pedágio.

Considere uma sequência de carros chegando a um pedágio.

O tempo necessário para que todos os carros passem pelo pedágio é análogo ao **atraso de transmissão**: cada carro precisa ser atendido e colocado na estrada seguinte.

Já o tempo necessário para um carro percorrer a estrada até o próximo pedágio é análogo ao **atraso de propagação**.

Assim:

\[
\text{pedágio}
\longleftrightarrow
\text{transmissão}
\]

e

\[
\text{estrada}
\longleftrightarrow
\text{propagação}.
\]

> **[Inserir figura]** Analogia desenhada em sala representando uma
> caravana de carros, um pedágio e o deslocamento pela estrada.

---

# Store-and-Forward

Em uma rede de comutação de pacotes, um roteador pode utilizar o mecanismo de **store-and-forward**.

Nesse caso, o roteador precisa receber o pacote antes de encaminhá-lo pelo próximo enlace.

Considere:

- $N$ enlaces;
- $P$ pacotes;
- pacotes de tamanho $L$;
- enlaces de taxa $R$.

O primeiro pacote precisa atravessar os $N$ enlaces.

Com o funcionamento em pipeline, os demais pacotes podem ser transmitidos enquanto os anteriores já percorrem os enlaces seguintes.

O atraso de transmissão é:

\[
d_{\text{trans}}
=
\frac{NL+(P-1)L}{R}.
\]

Portanto,

\[
\boxed{
d_{\text{trans}}
=
\frac{(N+P-1)L}{R}
}
\]

Esse resultado retoma a análise feita na aula anterior.

---

## Checksum

No mecanismo de store-and-forward, o equipamento recebe o pacote e pode verificar se ele chegou corretamente antes de encaminhá-lo.

Uma das ferramentas utilizadas para detecção de erros é o **checksum**.

A ideia geral é que informações adicionais sejam utilizadas para verificar a integridade dos dados recebidos.

> **Observação:** checksum foi mencionado em aula nesse contexto, mas seu funcionamento detalhado não foi desenvolvido neste momento.

---

# Packet Queuing Delay — Atraso de Fila

O atraso de fila é particularmente importante porque, diferentemente de alguns outros componentes do atraso, ele não possui necessariamente um valor fixo.

Pacotes diferentes podem encontrar filas de tamanhos diferentes.

Assim:

\[
d_{\text{fila}}
\]

é uma quantidade que depende do estado do sistema quando o pacote chega.

---

## Intensidade de Tráfego

Considere:

- $L$: tamanho médio dos pacotes, em bits;
- $R$: taxa do enlace, em bits/s;
- $a$: taxa média de chegada de pacotes, em pacotes/s.

A taxa média de chegada de dados é:

\[
La.
\]

A **intensidade de tráfego** é definida como:

\[
\boxed{
I=\frac{La}{R}
}
\]

Também podemos escrever:

\[
\rho=\frac{La}{R}.
\]

Nas anotações, $I$ e $\rho$ são utilizados para representar essa relação entre carga oferecida e capacidade do enlace.

---

## Relação com taxa de chegada e serviço

Defina:

\[
\lambda=a
\]

como a taxa de chegada de pacotes.

Como cada pacote possui tamanho médio $L$ e o enlace transmite $R$ bits/s, a taxa de serviço em pacotes/s é:

\[
\mu=\frac{R}{L}.
\]

Portanto:

\[
\rho
=
\frac{La}{R}
=
\frac{\lambda}{\mu}.
\]

Logo,

\[
\boxed{
\rho=\frac{\lambda}{\mu}
}
\]

A intensidade de tráfego compara a taxa com que pacotes chegam com a taxa com que podem ser atendidos.

---

## Comportamento do atraso de fila

Quando

\[
\rho\ll1,
\]

a taxa de serviço é muito superior à taxa média de chegada, e a fila tende a permanecer pequena.

À medida que:

\[
\rho\rightarrow1,
\]

a taxa de chegada se aproxima da capacidade de atendimento do enlace, fazendo o atraso de fila crescer significativamente.

De maneira qualitativa:

\[
\rho\uparrow
\quad\Longrightarrow\quad
d_{\text{fila}}\uparrow.
\]

> **[Inserir figura]** Gráfico feito em sala mostrando o atraso de fila
> crescendo rapidamente quando $\rho$ se aproxima de $1$.

Se

\[
\rho>1,
\]

a taxa média de chegada é maior que a capacidade média de serviço. Se essa situação persistir e a fila tiver capacidade ilimitada, o tamanho da fila continuará crescendo.

---

# Modelagem de Filas

O comportamento de uma fila é aleatório porque tanto as chegadas quanto os tempos de atendimento podem variar.

Uma representação básica de um sistema de filas é:

\[
\boxed{
\text{chegadas}
\longrightarrow
\text{fila}
\longrightarrow
\text{servidor}
\longrightarrow
\text{saídas}
}
\]

No contexto de redes:

- os **clientes** podem ser os pacotes;
- a **fila** corresponde aos pacotes aguardando transmissão;
- o **servidor** pode representar o enlace de saída;
- o **serviço** corresponde à transmissão do pacote.

---

## Estado do servidor

O servidor pode estar em dois estados:

\[
\text{ocioso}
\qquad\text{ou}\qquad
\text{ocupado}.
\]

A fração de tempo em que ele permanece ocupado está relacionada à utilização do sistema.

Seja:

\[
P(\text{ocupado})
\]

a probabilidade de observar o servidor ocupado.

---

## Taxa efetiva de saída

Considere $\mu$ como a taxa de serviço quando o servidor está ocupado.

A taxa média de saída pode ser escrita como:

\[
\lambda_{\text{out}}
=
E[\text{taxa de saída}\mid\text{ocupado}]
P(\text{ocupado})
+
E[\text{taxa de saída}\mid\text{ocioso}]
P(\text{ocioso}).
\]

Quando o servidor está ocupado:

\[
E[\text{taxa de saída}\mid\text{ocupado}]=\mu.
\]

Quando está ocioso:

\[
E[\text{taxa de saída}\mid\text{ocioso}]=0.
\]

Portanto:

\[
\lambda_{\text{out}}
=
\mu P(\text{ocupado}).
\]

Em equilíbrio, para um sistema estável:

\[
\lambda_{\text{out}}=\lambda.
\]

Logo:

\[
\lambda
=
\mu P(\text{ocupado}),
\]

e, portanto,

\[
\boxed{
P(\text{ocupado})
=
\frac{\lambda}{\mu}
=
\rho
}
\]

Consequentemente:

\[
\boxed{
P(\text{ocioso})
=
1-\rho
}
\]

---

# Lei de Little

## Teorema 5.1 — Lei de Little

Considere um sistema estável em equilíbrio.

Sejam:

- $\bar{N}$: número médio de clientes no sistema;
- $\lambda$: taxa média de chegada;
- $\bar{X}$: tempo médio que um cliente permanece no sistema.

Então:

\[
\boxed{
\bar{N}
=
\lambda\bar{X}
}
\]

Essa relação é conhecida como **Lei de Little**.

---

## Interpretação

A Lei de Little relaciona:

\[
\text{quantidade média no sistema}
=
\text{taxa de chegada}
\times
\text{tempo médio no sistema}.
\]

As unidades ajudam a interpretar a expressão:

\[
\frac{\text{clientes}}{\text{tempo}}
\times
\text{tempo}
=
\text{clientes}.
\]

Portanto:

\[
\lambda\bar{X}
\]

representa o número médio de clientes presentes no sistema.

---

## Aplicação à fila

Podemos aplicar a Lei de Little tanto ao sistema completo quanto apenas à fila.

### Sistema completo

Se:

- $\bar{N}_s$: número médio de clientes no sistema;
- $\bar{X}_s$: tempo médio no sistema;

então:

\[
\boxed{
\bar{N}_s
=
\lambda\bar{X}_s
}
\]

### Apenas a fila

Se:

- $\bar{N}_q$: número médio de clientes esperando na fila;
- $\bar{X}_q$: tempo médio de espera na fila;

então:

\[
\boxed{
\bar{N}_q
=
\lambda\bar{X}_q
}
\]

---

## Sistema versus fila

É importante distinguir:

\[
\text{sistema}
=
\text{fila}
+
\text{servidor}.
\]

Um cliente que está sendo atendido pertence ao sistema, mas já não está esperando na fila.

Assim, podemos estudar separadamente:

- número médio no **sistema**;
- número médio na **fila**;
- tempo médio no **sistema**;
- tempo médio de espera na **fila**.

> **[Inserir figura]** Diagrama feito em sala destacando a fronteira do
> sistema, a fila de espera e o servidor.

---

## Demonstração intuitiva da Lei de Little

A Lei de Little pode ser entendida por meio de uma interpretação de conservação.

Durante um intervalo longo de tempo $T$, aproximadamente

\[
\lambda T
\]

clientes entram no sistema.

Se cada cliente permanece, em média, durante $\bar{X}$ unidades de tempo, o tempo total acumulado de permanência dos clientes é aproximadamente:

\[
\lambda T\bar{X}.
\]

Dividindo esse tempo acumulado pelo intervalo observado $T$:

\[
\bar{N}
=
\frac{\lambda T\bar{X}}{T}.
\]

Logo:

\[
\boxed{
\bar{N}
=
\lambda\bar{X}
}
\]

> **Observação:** essa é uma interpretação intuitiva da relação. A aula
> registra a Lei de Little e sua aplicação ao sistema/fila, sem apresentar
> uma demonstração formal completa.