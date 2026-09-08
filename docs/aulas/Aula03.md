# Aula 03 — 19/08/2026

# Introdução às Redes — Continuação

## Packet Switching e Circuit Switching

Uma diferença importante entre redes está na maneira como seus recursos são utilizados.

### Packet Switching

No **packet switching** (comutação de pacotes), os recursos da rede são **compartilhados**.

Os pacotes de diferentes usuários podem utilizar os mesmos enlaces, sem que uma parcela fixa da capacidade seja permanentemente reservada para cada usuário.

A Internet utiliza predominantemente **packet switching**.

### Circuit Switching

No **circuit switching** (comutação de circuitos), recursos são **reservados** para uma determinada comunicação.

Essa reserva pode ser implementada por técnicas como:

- **FDMA** — divisão por frequência;
- **TDMA** — divisão por tempo;
- **CDMA** — divisão por código.

Um exemplo tradicional de utilização de circuit switching é a telefonia.

Assim, de maneira simplificada:

| Packet Switching | Circuit Switching |
|---|---|
| Recursos compartilhados | Recursos reservados |
| Utilizado na Internet | Tradicionalmente associado à telefonia |
| Maior aproveitamento estatístico dos recursos | Garantia de recursos durante a comunicação |

---

# Atrasos em Redes

Ao transmitir um pacote pela rede, diferentes tipos de atraso podem ser introduzidos.

Nesta aula foram considerados principalmente:

- **atraso de transmissão**;
- **atraso de propagação**;
- **atraso de fila**.

---

## Atraso de Transmissão

Considere:

- $L$: tamanho do pacote, em bits;
- $R$: taxa de transmissão do enlace, em bits/s.

O **atraso de transmissão** é o tempo necessário para colocar todos os bits do pacote no enlace:

\[
\boxed{
d_{\text{trans}}=\frac{L}{R}
}
\]

Portanto:

\[
d_{\text{trans}}
=
\frac{\text{bits}}{\text{bits/s}}
=
\text{s}.
\]

O atraso de transmissão depende:

- do tamanho $L$ do pacote;
- da taxa $R$ do enlace.

Quanto maior o pacote, maior o tempo necessário para transmiti-lo.

Quanto maior a taxa de transmissão, menor o atraso:

\[
R\uparrow
\quad\Longrightarrow\quad
d_{\text{trans}}\downarrow.
\]

---

## Atraso de Propagação

Depois que um bit é colocado no enlace, ele precisa se propagar fisicamente pelo meio até o receptor.

Considere:

- $D$: distância percorrida;
- $v_{\text{prop}}$: velocidade de propagação do sinal no meio.

O **atraso de propagação** é:

\[
\boxed{
d_{\text{prop}}
=
\frac{D}{v_{\text{prop}}}
}
\]

Esse atraso depende da distância e da velocidade de propagação do meio.

É importante distinguir:

\[
\boxed{
d_{\text{trans}}=\frac{L}{R}
}
\qquad\text{e}\qquad
\boxed{
d_{\text{prop}}=\frac{D}{v_{\text{prop}}}
}
\]

O primeiro está relacionado ao tempo para **inserir o pacote no enlace**; o segundo, ao tempo para o sinal **percorrer fisicamente o enlace**.

---

## Representação da transmissão de um pacote

Considere um emissor $E$ e um receptor separados por um enlace.

No instante inicial, o transmissor começa a inserir os bits no enlace.

Após

\[
\frac{L}{R},
\]

o último bit do pacote termina de ser colocado no enlace.

Esse último bit ainda precisa percorrer o meio físico até o receptor, acrescentando o atraso de propagação.

Portanto, considerando apenas transmissão e propagação:

\[
\boxed{
d
=
\frac{L}{R}
+
\frac{D}{v_{\text{prop}}}
}
\]

> **[Inserir figura]** Diagrama espaço-tempo feito em sala mostrando
> emissor, receptor, transmissão do pacote e propagação pelo enlace.

---

# Transmissão através de dois enlaces

Considere agora um pacote de tamanho $L$ que precisa atravessar dois enlaces:

\[
E
\xrightarrow{R_1}
\text{Roteador}
\xrightarrow{R_2}
D.
\]

Supondo que o roteador utilize **store-and-forward**, ele precisa receber o pacote antes de encaminhá-lo pelo próximo enlace.

Desconsiderando inicialmente propagação e filas, o atraso de transmissão é:

\[
d_{\text{trans}}
=
\frac{L}{R_1}
+
\frac{L}{R_2}.
\]

---

## Caso $R_1 \gg R_2$

Se

\[
R_1 \gg R_2,
\]

então:

\[
\frac{L}{R_1}
\ll
\frac{L}{R_2}.
\]

O segundo enlace é muito mais lento e passa a dominar o tempo de transmissão.

Assim,

\[
d_{\text{trans}}
=
\frac{L}{R_1}
+
\frac{L}{R_2}
\approx
\frac{L}{R_2}.
\]

Nesse caso, $R_2$ funciona como um **gargalo** (*bottleneck*).

---

## Caso $R_1 \ll R_2$

Se

\[
R_1 \ll R_2,
\]

então:

\[
\frac{L}{R_1}
\gg
\frac{L}{R_2}.
\]

Agora, o primeiro enlace é o mais lento e domina o tempo de transmissão.

De maneira geral, a taxa efetiva da comunicação é limitada pelo enlace de menor capacidade:

\[
\boxed{
R_{\text{efetiva}}
=
\min(R_1,R_2)
}
\]

Esse enlace é denominado **gargalo** da comunicação.

---

# Múltiplos enlaces

Considere um caminho formado por $N$ enlaces.

Para um único pacote de tamanho $L$, se todos os enlaces possuem taxa $R$ e utilizam store-and-forward, o pacote precisa ser transmitido em cada um dos $N$ enlaces.

Desconsiderando propagação, filas e processamento:

\[
\boxed{
d_{\text{trans}}
=
N\frac{L}{R}
}
\]

Se os enlaces tiverem taxas diferentes $R_1,\ldots,R_N$, então:

\[
d_{\text{trans}}
=
\sum_{i=1}^{N}\frac{L}{R_i}.
\]

---

# Transmissão de vários pacotes

Considere agora:

- $P$ pacotes;
- cada pacote com tamanho $L$;
- $N$ enlaces;
- todos os enlaces com taxa $R$.

O primeiro pacote precisa atravessar os $N$ enlaces:

\[
N\frac{L}{R}.
\]

Entretanto, depois que ele deixa o primeiro enlace, o segundo pacote pode começar a utilizá-lo.

Isso permite um funcionamento em **pipeline**.

## Pipeline

Depois que o pipeline está preenchido, novos pacotes podem chegar ao destino separados por:

\[
\frac{L}{R}.
\]

Assim:

- o primeiro pacote leva $N\frac{L}{R}$;
- cada um dos $P-1$ pacotes restantes acrescenta $\frac{L}{R}$.

Logo:

\[
d_{\text{trans}}
=
N\frac{L}{R}
+
(P-1)\frac{L}{R}.
\]

Portanto,

\[
\boxed{
d_{\text{trans}}
=
\frac{(N+P-1)L}{R}
}
\]

ou, equivalentemente,

\[
\boxed{
d_{\text{trans}}
=
\frac{PL+(N-1)L}{R}
}
\]

> **[Inserir figura]** Diagrama temporal feito em sala mostrando vários
> pacotes sendo transmitidos em pipeline através de vários enlaces.

---

## Forma mais geral

Se o tamanho total original da informação for $L'$ e ela for dividida em $P$ pacotes de tamanho $L$, então:

\[
L'=PL.
\]

Substituindo na expressão anterior:

\[
d_{\text{trans}}
=
\frac{L'+(N-1)L}{R}.
\]

Essa expressão mostra que a divisão da informação em pacotes permite que diferentes enlaces trabalhem simultaneamente, formando um pipeline.

---

# Filas

As **filas** se formam principalmente nos enlaces de saída dos roteadores.

Quando pacotes chegam a um roteador mais rapidamente do que conseguem ser transmitidos pelo enlace de saída, eles precisam aguardar.

Assim, o atraso experimentado por um pacote não depende apenas de transmissão e propagação: ele também pode incluir um **atraso de fila**.

---

## Atraso de fila

O atraso de fila depende do nível de utilização do enlace.

Uma medida importante é a **intensidade de tráfego**:

\[
\boxed{
\rho = \frac{La}{R}
}
\]

onde:

- $L$ é o tamanho médio dos pacotes, em bits;
- $a$ é a taxa média de chegada de pacotes, em pacotes/s;
- $R$ é a taxa de transmissão do enlace, em bits/s.

O produto

\[
La
\]

representa a taxa média de chegada de dados, em bits/s.

Assim, $\rho$ compara a carga oferecida à capacidade disponível no enlace.

---

## Comportamento da fila

Quando a intensidade de tráfego é pequena, o enlace consegue transmitir os pacotes sem acumular uma fila significativa.

À medida que

\[
\rho \rightarrow 1,
\]

o atraso médio de fila cresce rapidamente.

Uma expressão utilizada para representar esse comportamento é:

\[
\boxed{
d_{\text{fila}}
\propto
\frac{\rho}{1-\rho}
}
\]

O ponto importante é o comportamento do denominador:

\[
1-\rho \rightarrow 0
\qquad\text{quando}\qquad
\rho\rightarrow1.
\]

Consequentemente, o atraso pode crescer muito quando a taxa de chegada se aproxima da capacidade de serviço do enlace.

> **[Inserir figura]** Gráfico feito em sala mostrando o crescimento do
> atraso de fila à medida que a intensidade de tráfego se aproxima de $1$.

---

# Packet Switching × Circuit Switching

A discussão sobre filas ajuda a entender uma diferença importante entre **packet switching** e **circuit switching**.

## Packet Switching

No packet switching:

- os recursos são compartilhados;
- não existe necessariamente uma parcela fixa da capacidade reservada para cada usuário;
- a utilização da capacidade pode ser mais eficiente;
- podem surgir filas quando muitos pacotes disputam simultaneamente os mesmos recursos.

### Vantagem

O compartilhamento permite aproveitar a capacidade que não está sendo utilizada por outros usuários.

### Desvantagem

Não existe necessariamente uma garantia fixa de recursos, e congestionamentos podem produzir filas e atrasos.

---

## Circuit Switching

No circuit switching:

- recursos são reservados;
- uma parcela da capacidade é destinada à comunicação;
- há maior previsibilidade de recursos durante a conexão.

### Vantagem

\[
\boxed{\text{Garantia de recursos}}
\]

### Desvantagem

Se o recurso reservado não estiver sendo utilizado, ele pode permanecer ocioso, produzindo desperdício.

---

## Comparação

| Característica | Packet Switching | Circuit Switching |
|---|---|---|
| Recursos | Compartilhados | Reservados |
| Utilização | Dinâmica | Pré-alocada |
| Filas | Podem ocorrer | Evitadas pela reserva de capacidade |
| Garantia de capacidade | Não necessariamente | Sim |
| Aproveitamento de capacidade ociosa | Maior | Menor |
| Possibilidade de desperdício por reserva | Menor | Maior |

A escolha entre as duas abordagens envolve, portanto, um compromisso entre **eficiência no compartilhamento dos recursos** e **garantia de capacidade**.