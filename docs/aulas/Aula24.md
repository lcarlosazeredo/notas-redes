# Aula 24 — 13/11/2026

> **Base principal:** anotações manuscritas da aula.  
> **Complementos:** *Computer Networking: A Top-Down Approach*, 8ª ed., Kurose & Ross, principalmente Capítulo 5, Seção 5.2.  
> Quando um trecho da anotação está abreviado ou pouco legível, o complemento é indicado explicitamente.

## Retomada — Dijkstra e Bellman-Ford

A aula começa retomando os dois algoritmos estudados:

- Dijkstra;
- Bellman-Ford.

Uma observação feita em sala foi a importância de manter uma terminologia consistente ao comparar os dois algoritmos.

---

## Dijkstra

Considere uma origem $u$.

Inicialmente:

$$
N' \leftarrow \{u\}.
$$

Em cada passo, escolhemos um vértice $w$ tal que:

$$
w\notin N'
$$

e:

$$
D_u(w)
$$

é mínimo entre os nós ainda não adicionados.

Depois:

$$
N'
\leftarrow
N'\cup\{w\}.
$$

Para cada vértice $v$ ainda não finalizado, atualizamos:

$$
\boxed{
D_u(v)
=
\min
\left\{
D_u(v),
D_u(w)+c(w,v)
\right\}
}
$$

### Por que Dijkstra é guloso?

A anotação destaca:

> $N'$ cresce de forma gulosa.

Em cada passo, o algoritmo escolhe definitivamente o nó que possui a menor distância conhecida naquele momento.

Assim, o algoritmo toma uma decisão local ótima e não volta atrás nessa decisão.

---

## Bellman-Ford

No Distance Vector, cada nó recebe dos vizinhos estimativas de distância e recalcula seus próprios valores.

A forma geral é:

$$
\boxed{
D_u(x)
=
\min_{v\in N(u)}
\left\{
c(u,v)+D_v(x)
\right\}
}
$$

onde:

- $u$ é o nó atual;
- $v$ é um vizinho de $u$;
- $x$ é o destino;
- $c(u,v)$ é o custo até o vizinho;
- $D_v(x)$ é a estimativa do vizinho até o destino.

A parcela:

$$
D_v(x)
$$

é tratada nas anotações como o:

**cost-to-go**.

---

## Bellman-Ford e Programação Dinâmica

Nas anotações:

> Bellman-Ford é um algoritmo de Programação Dinâmica.

A ideia é:

1. quebrar um problema maior em problemas menores;
2. calcular soluções parciais;
3. reutilizar essas soluções para construir a solução do problema maior.

No Bellman-Ford, o nó $u$ utiliza os custos já calculados pelos vizinhos para obter seu próprio menor custo.

### Princípio de otimalidade

Foi anotada a seguinte ideia:

> “Sufixo de caminho mais curto também é um caminho mais curto.”

Isto é, se um caminho ótimo de $u$ até $x$ passa por $v$, então o trecho de $v$ até $x$ também precisa ser um caminho ótimo entre esses dois nós.

Essa propriedade permite reutilizar os **cost-to-go** na equação de Bellman-Ford.

---

## Tempo de convergência no Distance Vector

Nas anotações, o tempo de convergência aparece relacionado à alteração dos valores dos enlaces.

O comportamento não é simétrico.

### Redução de custo

Quando o custo de um enlace diminui, a informação tende a se propagar rapidamente.

O Kurose resume esse caso como:

> **good news travels fast**.

### Aumento de custo

Quando o custo de um enlace aumenta, o Distance Vector pode demorar muito mais para convergir.

Nesse caso:

> **bad news travels slowly**.

Isso ocorre porque os roteadores podem continuar utilizando estimativas antigas uns dos outros.

---

# Distance Vector — Link Cost Change

## Inicialização

As anotações chamam atenção para a inicialização das estimativas.

Para um nó $x$:

- destino diretamente conectado:

$$
D_x(y)=c(x,y);
$$

- destino inicialmente desconhecido:

$$
D_x(y)=\infty.
$$

Assim, não se deve simplesmente inicializar todas as distâncias desconhecidas com zero.

O valor:

$$
\infty
$$

representa que ainda não existe um caminho conhecido.

---

## Exemplo — mudança de custo

Considere a topologia:

```text
       4
   x ------- y
    \       /
   50\     /1
      \   /
        z
```

Inicialmente:

$$
c(x,y)=4,
$$

$$
c(y,z)=1,
$$

$$
c(x,z)=50.
$$

Os menores custos são:

### Nó $y$

$$
D_y(x)=4
$$

e:

$$
D_y(z)=1.
$$

### Nó $z$

Para chegar a $x$, $z$ utiliza $y$:

$$
D_z(x)
=
1+4
=
5.
$$

Logo:

$$
D_z(x)=5
$$

e:

$$
D_z(y)=1.
$$

---

## O custo $c(y,x)$ aumenta

Agora:

$$
c(y,x)
:
4
\longrightarrow
60.
$$

A nova topologia é:

```text
       60
   x -------- y
    \        /
   50\      /1
      \    /
        z
```

Quando $y$ detecta a mudança, ele ainda possui a informação antiga:

$$
D_z(x)=5.
$$

Por isso, calcula:

$$
D_y(x)
=
\min
\left\{
60,\,
1+5
\right\}.
$$

Logo:

$$
\boxed{
D_y(x)=6
}
$$

O problema é que o valor $5$ anunciado por $z$ correspondia justamente ao caminho:

$$
z\rightarrow y\rightarrow x.
$$

Então $y$ passa a acreditar que pode chegar a $x$ através de $z$, enquanto $z$ ainda acredita que chega a $x$ através de $y$.

Forma-se um **routing loop**.

---

## Count-to-Infinity

Depois que $y$ anuncia:

$$
D_y(x)=6,
$$

o nó $z$ recalcula:

$$
D_z(x)
=
\min
\left\{
50,\,
1+6
\right\}
=
7.
$$

Então:

$$
\boxed{
D_z(x)=7
}
$$

Depois $y$ recebe esse novo valor e calcula:

$$
D_y(x)
=
1+7
=
8.
$$

Em seguida:

$$
D_z(x)=1+8=9.
$$

O processo continua:

$$
6,\ 7,\ 8,\ 9,\ 10,\ldots
$$

até que o custo via o outro nó fique maior que o enlace direto:

$$
50.
$$

Nesse momento, $z$ finalmente escolhe:

$$
z\rightarrow x
$$

com custo:

$$
50.
$$

Depois $y$ pode utilizar:

$$
y\rightarrow z\rightarrow x
$$

com custo:

$$
51.
$$

Esse fenômeno é chamado:

$$
\boxed{
\text{Count-to-Infinity}
}
$$

> **Referência:** Kurose & Ross, 8ª ed., Seção 5.2.2, Figura 5.7.

---

## Por que o problema acontece?

Cada nó conhece apenas:

- seus custos diretos;
- as estimativas informadas por seus vizinhos.

Ele não conhece necessariamente o caminho completo usado pelo vizinho.

Assim, $y$ recebe de $z$:

> “Eu chego a $x$ com custo 5.”

Mas $y$ não percebe que esse caminho de $z$ até $x$ passava pelo próprio $y$.

Portanto:

$$
\boxed{
\text{informação local incompleta}
\Rightarrow
\text{possibilidade de loop}
}
$$

---

# Formas de lidar com o Count-to-Infinity

## 1. Poisoned Reverse

Nas anotações, essa estratégia aparece como uma espécie de:

> **“mentira branca”**.

Se $z$ utiliza $y$ para chegar a $x$, então $z$ informa especificamente a $y$:

$$
\boxed{
D_z(x)=\infty
}
$$

mesmo sabendo que seu custo real é:

$$
D_z(x)=5.
$$

A razão é impedir que $y$ tente utilizar $z$ para chegar a $x$.

Assim:

```text
z usa y para chegar a x
        |
        v
z anuncia a y:
Dz(x) = ∞
```

Quando o custo $c(y,x)$ aumenta para 60, $y$ não pode usar a falsa rota via $z$, porque acredita que:

$$
D_z(x)=\infty.
$$

Então escolhe inicialmente:

$$
D_y(x)=60.
$$

Isso evita o loop de dois nós do exemplo.

### Limitação

O Kurose destaca que o Poisoned Reverse:

- resolve esse tipo de loop envolvendo dois nós;
- **não resolve o problema geral** de Count-to-Infinity.

Loops envolvendo três ou mais roteadores ainda podem acontecer.

---

## 2. Reinicialização / descarte de informação antiga

Nas anotações aparece uma segunda ideia descrita como:

> “reset” da rede.

A anotação associa essa abordagem a protocolos Distance Vector, mas não desenvolve formalmente o mecanismo.

A ideia geral anotada é evitar continuar utilizando indefinidamente informações antigas que podem ter se tornado inválidas após uma mudança de topologia.

> **Observação:** o manuscrito não contém detalhes suficientes para identificar exatamente qual mecanismo específico o professor pretendia formalizar nesse ponto.

---

## 3. Trocar o caminho completo

Outra possibilidade anotada é:

> **troca de caminho completo**

em vez de anunciar apenas uma distância.

Assim, o nó não informa somente:

$$
\text{“custo}=5\text{”},
$$

mas também informa por quais nós/sistemas o caminho passa.

Isso permite detectar loops mais facilmente.

Essa é a ideia associada aos protocolos do tipo:

**Path Vector**.

### Relação com BGP

O principal exemplo é o BGP.

No BGP, a rota contém informação sobre a sequência de Sistemas Autônomos atravessados:

$$
\boxed{
AS\_PATH
}
$$

Se um AS recebe uma rota que já contém seu próprio número no `AS_PATH`, ele pode detectar o loop e rejeitar a rota.

Assim:

$$
\boxed{
\text{BGP}
\rightarrow
\text{Path Vector}
}
$$

---

# Poisoned Reverse não é uma solução global

Uma anotação importante da página 3 é:

> resolve um problema local, mas não global.

Isso se aplica ao Poisoned Reverse.

Ele funciona no exemplo com:

$$
y\leftrightarrow z,
$$

mas em uma topologia maior podem existir loops envolvendo mais nós.

Portanto:

$$
\boxed{
\text{Poisoned Reverse}
\neq
\text{solução geral para todos os loops DV}
}
$$

---

## Comparação das informações trocadas

### Link State

Cada roteador anuncia:

- seus vizinhos;
- os custos de seus enlaces.

Essas informações são disseminadas pela rede.

Depois, cada roteador constrói a topologia completa.

### Distance Vector

Cada roteador anuncia aos vizinhos:

- sua estimativa de distância até os destinos.

Não informa necessariamente o caminho completo.

### Path Vector

O anúncio inclui:

- informações sobre o caminho percorrido.

Isso permite detectar ciclos diretamente na sequência anunciada.

---

# Observações sobre protocolos

Nas anotações aparece uma lista de protocolos do Capítulo 5 que não foram desenvolvidos em detalhe nesta aula.

São legíveis:

- OSPF;
- RIP;
- ICMP.

Há ainda uma terceira sigla entre RIP e ICMP que está pouco legível no manuscrito.

> **Observação:** esses protocolos foram apenas listados nesta página, sem desenvolvimento conceitual suficiente para uma transcrição detalhada.

---

# Escopo anotado para a prova

Nas anotações aparece explicitamente:

> **Prova até Dijkstra e Bellman.**

Também aparece como limite:

> **até o problema de Count-to-Infinity**.

Há ainda uma divisão aproximada do conteúdo da prova envolvendo:

- parte do Capítulo 3;
- Capítulo 4;
- parte do Capítulo 5.

Os detalhes da tabela de distribuição estão parcialmente ilegíveis e, portanto, não foram completados.

---

## Resumo

Os principais tópicos desta aula foram:

- retomada de Dijkstra e Bellman-Ford;
- Dijkstra como algoritmo guloso;
- Bellman-Ford como Programação Dinâmica;
- princípio de otimalidade;
- `cost-to-go`;
- atualização de Dijkstra:

$$
D_u(v)
=
\min
\left\{
D_u(v),
D_u(w)+c(w,v)
\right\};
$$

- atualização de Bellman-Ford:

$$
D_u(x)
=
\min_v
\left\{
c(u,v)+D_v(x)
\right\};
$$

- convergência no Distance Vector;
- redução de custo propagando rapidamente;
- aumento de custo propagando lentamente;
- mudança:

$$
c(y,x):4\rightarrow60;
$$

- sequência:

$$
6,7,8,9,\ldots;
$$

- Count-to-Infinity;
- routing loop;
- Poisoned Reverse;
- limitação do Poisoned Reverse;
- Path Vector;
- relação com BGP e `AS_PATH`;
- escopo da prova até Dijkstra, Bellman-Ford e Count-to-Infinity.
