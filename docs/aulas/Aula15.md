# Aula 15 — 02/10/2026

## Retomada da aula anterior

### Reliable Data Transfer e janela

Na aula passada foi retomada a ideia de **Reliable Data Transfer (RDT)**.

Nas anotações aparecem duas situações:

- **sem janela**;
- uso de **janela fixa**.

Na parte de desempenho, foram trabalhados:

- **GBN — Go-Back-N**;
- **SR — Selective Repeat**.

> **Observação:** GBN e SR já haviam sido cobertos na aula anterior.

---

## Conteúdo da aula

Nesta aula, o foco passa para:

- **Selective Repeat (SR)**;
- **TCP** e sua implementação.

Nas anotações aparece como referência:

- slides aproximadamente **73–107**.

Para a aula seguinte foram indicados:

- **tamanho de janela dinâmico**;
- **controle de congestionamento**;
- **TCP AIMD**;
- slides aproximadamente **107–142**.

Também foi comentado que o trabalho final costuma envolver essa área, especialmente temas relacionados a controle de congestionamento.

> **Observação:** há uma anotação adicional sobre projeto/trabalho em grupo e prazo, mas esse trecho está pouco legível no manuscrito.

---

## Go-Back-N

A partir do **RDT 2.2**, as anotações destacam que o desenvolvimento passa a trabalhar apenas com:

- **ACK**;
- sem **NAK**.

No **Go-Back-N**:

- a janela é controlada pelos ACKs;
- assume-se inicialmente uma **janela fixa**.

### Perguntas levantadas

Foram destacadas duas questões:

1. como obter/estimar o **timeout**;
2. como determinar o **tamanho da janela**.

Nas anotações aparece que, para o timeout, é necessário considerar o comportamento do TCP e o RTT.

Para o tamanho da janela, aparece a relação com o chamado **produto delay-banda**.

---

## Utilização no Stop-and-Wait

Para Stop-and-Wait, a utilização é escrita como:

$$
U_{\text{stop-and-wait}}
=
\frac{L/R}{L/R+RTT}.
$$

Equivalentemente:

$$
\boxed{
U_{\text{stop-and-wait}}
=
\frac{1}{
1+\dfrac{RTT\cdot R}{L}
}
}
$$

A quantidade:

$$
\frac{RTT\cdot R}{L}
$$

aparece nas anotações associada ao produto delay-banda e como referência para o número de pacotes que podem estar em trânsito.

### Valor de referência para $N$

Como referência para o tamanho da janela:

$$
\boxed{
N
\sim
\frac{RTT}{L/R}
=
\frac{RTT\cdot R}{L}
}
$$

O diagrama feito em sala representa vários pacotes ocupando o caminho enquanto os ACKs ainda estão retornando.

---

## Utilização no Go-Back-N

Para uma janela de tamanho $N$, o tempo útil de transmissão pode ser representado por:

$$
N\frac{L}{R}.
$$

Uma expressão anotada para a utilização é:

$$
U
=
\frac{\text{tempo útil}}
{\text{tempo útil}+\text{tempo ocioso}}
=
\frac{
N\dfrac{L}{R}
}{
N\dfrac{L}{R}
+
\text{tempo ocioso}
}.
$$

> **Observação:** nas anotações é destacado que o tempo ocioso nem sempre é simples de calcular.

### Análise por ciclos

Analisando através de ciclos:

$$
U
=
\frac{\text{tempo útil}}
{\text{tempo do ciclo}}.
$$

Foi escrita em sala a relação:

$$
\boxed{
U
=
\frac{
N\dfrac{L}{R}
}{
\dfrac{L}{R}+RTT
}
}
$$

Também aparece a observação de que, para a análise de utilização, assume-se um transmissor **saturado**, isto é, assim que pode enviar um novo pacote, envia.

---

## Produto delay-banda

Nas anotações aparece a relação:

$$
RTT\cdot R.
$$

Ela é associada à quantidade de dados que pode estar simultaneamente “navegando” pelo caminho antes da chegada dos ACKs.

Também aparece a ideia de escolher $N$ de modo que seja possível enviar os pacotes da janela antes que o ACK do primeiro pacote retorne.

> **Observação:** no manuscrito, $RTT\cdot R$ aparece diretamente associado ao número de pacotes; em outra parte da mesma aula aparece a forma normalizada pelo tamanho do pacote, $\dfrac{RTT\cdot R}{L}$.

---

## Janela do Go-Back-N

### Sender

As anotações representam a janela do emissor dividida em regiões, indicadas por cores:

- verde;
- amarelo;
- azul;
- branco.

A região correspondente à janela corrente possui tamanho:

$$
\text{Window Size}.
$$

Também aparece o caso:

> **Caso azul: não saturado.**

Para o cálculo de utilização, porém, assume-se o caso **saturado**:

> Assim que chega a oportunidade de enviar, envia.

### Receiver

No receptor, as regiões da janela também aparecem representadas por cores.

Nas anotações consta:

> Pode estar misturado.

---

## Go-Back-N e ordem dos pacotes

No **GBN**, os pacotes são tratados em sequência.

Nas anotações aparece:

> GBN → sempre corre em sequência.

Já no **Selective Repeat**, pode haver alteração na ordem observada.

Também é destacado que, no GBN:

> **ACK é cumulativo.**

---

## Selective Repeat — SR

No **Selective Repeat**, cada pacote não confirmado precisa ser acompanhado individualmente.

### Timers

As anotações indicam:

> Manter um timer para cada pacote não confirmado.

### ACKs

No SR:

- os ACKs são **seletivos**;
- diferentemente do ACK cumulativo do GBN.

Assim, são reenviados somente os pacotes que ainda não foram confirmados.

---

## Selective Repeat — problema com números de sequência

As anotações destacam um “dilema” do Selective Repeat relacionado aos números de sequência.

**Problema anotado:**

> Não ter um número de sequência específico para cada pacote.

**Solução anotada:**

> Aumentar o *pool* de números de sequência disponíveis.

Também aparece a seguinte observação:

> Se o espaço de números de sequência for o dobro do tamanho da janela, sob certas hipóteses esse problema não ocorre.

Há ainda uma anotação indicando:

> Não tem reordenamento.

> **Observação:** este trecho foi mantido conforme aparece no manuscrito; a formulação exata das hipóteses não foi desenvolvida nas páginas desta aula.

### Função do número de sequência

O número de sequência é introduzido para permitir distinguir:

- uma nova mensagem;
- uma retransmissão.

---

## Diferença visual entre GBN e SR

As anotações destacam que GBN e SR podem ser visualmente distinguidos quando aparece um:

> **“buraco”**

entre pacotes confirmados e não confirmados.

Esse comportamento está relacionado à possibilidade de o SR aceitar confirmações e pacotes de forma seletiva.

---

## Comparação entre GBN e SR

A tabela feita em sala compara os dois mecanismos.

| Característica | GBN | SR |
|---|---|---|
| ACK | Cumulativo | Seletivo |
| Retransmissão | Janela inteira a partir do ponto necessário | Apenas o pacote necessário |
| Timer | 1 timer | 1 timer lógico por pacote |

Nas anotações também aparece a sugestão de acrescentar uma coluna indicando:

> **se descarta ou não**.

### Vantagens destacadas

**GBN.**

Uma vantagem destacada é o uso de:

- ACK cumulativo.

**SR.**

A vantagem destacada é que:

- não sobrecarrega tanto o transmissor;
- retransmite somente o pacote necessário.

---

## TCP — como combina ideias de GBN e SR

A aula termina discutindo como o TCP aproveita características de GBN e SR.

### ACK

O TCP utiliza:

- **ACK cumulativo**.

Nesse aspecto, aproxima-se do GBN.

### Retransmissão

Em caso de problema, o TCP não precisa retransmitir toda a janela.

Nas anotações aparece a ideia de retransmitir apenas o pacote necessário.

### Timer

Se ocorrer timeout, a anotação indica atenção ao:

> pacote mais antigo.

O TCP não utiliza um timer físico independente para cada pacote da mesma forma conceitual mostrada no SR.

---

## ACK duplicado no TCP

Nas anotações aparece que o TCP:

- não trabalha simplesmente com ACK seletivo;
- utiliza **ACK duplicado** para indicar que existe uma lacuna na sequência recebida.

Assim, o ACK duplicado aparece como uma forma de sinalizar que algum segmento esperado não chegou.

A anotação resume essa ideia como:

> uma forma de simular uma informação seletiva a partir do ACK cumulativo.

Também aparece a observação:

> não descarta quando tem um *gap*.

---

## Resumo

Os principais pontos desta aula foram:

- retomada de GBN e SR;
- uso de janela fixa;
- ACK sem NAK a partir do desenvolvimento após o RDT 2.2;
- relação entre RTT, taxa do enlace e tamanho da janela;
- utilização em Stop-and-Wait;
- utilização em Go-Back-N;
- produto delay-banda;
- janela do emissor e do receptor;
- ACK cumulativo no GBN;
- ACK seletivo no SR;
- timers por pacote no SR;
- problema do espaço de números de sequência no SR;
- comparação entre GBN e SR;
- TCP combinando características de GBN e SR;
- ACK cumulativo e ACK duplicado no TCP;
- indicação de controle de congestionamento e TCP AIMD para a sequência da disciplina.
