# Aula 23 — 11/11/2026

> **Base principal:** anotações manuscritas da aula.  
> **Complementos:** *Computer Networking: A Top-Down Approach*, 8ª ed., Kurose & Ross, principalmente Capítulo 5, Seções 5.1, 5.2.1 e 5.2.2.  
> Os complementos abaixo servem apenas para organizar e esclarecer os tópicos efetivamente trabalhados em sala.

## Retomada da aula anterior

Na aula anterior foi iniciado o **Capítulo 5 — Camada de Rede: Control Plane**, com foco em:

- algoritmos de roteamento;
- Dijkstra;
- Bellman-Ford;
- Link State;
- Distance Vector.

Nesta aula, esses tópicos foram aprofundados.

---

## Dijkstra × Bellman-Ford

Os dois algoritmos têm o mesmo objetivo geral:

> encontrar caminhos de menor custo na rede.

A diferença principal está em:

- quais informações cada nó possui;
- como essas informações são obtidas;
- como o cálculo é realizado.

### Comparação inicial

| Algoritmo | Classe | Como é utilizado |
|---|---|---|
| Dijkstra | Link State | Cada nó divulga o custo de seus enlaces; após a divulgação, todos possuem uma visão global da rede e executam Dijkstra localmente |
| Bellman-Ford | Distance Vector | Cada nó mantém estimativas de custo até os destinos e troca essas estimativas apenas com seus vizinhos |

---

## Dijkstra — Link State

No algoritmo Link State, cada roteador precisa conhecer a topologia completa da rede considerada.

### Passo 1 — divulgação dos custos

Cada nó $i$ divulga aos demais nós informações sobre seus enlaces diretamente conectados:

$$
c(i,j).
$$

Depois que essas informações são disseminadas, cada nó passa a possuir uma visão global da topologia.

Assim:

$$
\boxed{
\text{Link State}
\Rightarrow
\text{informação global}
}
$$

### Passo 2 — cálculo local

Depois de possuir o mapa completo da rede, cada nó executa o algoritmo de Dijkstra tomando a si próprio como origem.

Portanto:

$$
\boxed{
\text{cada roteador executa seu próprio Dijkstra}
}
$$

> **Referência:** Kurose & Ross, 8ª ed., Seção 5.2.1.

---

## Bellman-Ford — Distance Vector

No Distance Vector, um roteador não precisa conhecer toda a topologia.

Ele conhece:

- o custo dos enlaces diretamente conectados;
- estimativas de distância recebidas dos vizinhos.

### Passo 1 — envio do Distance Vector

Quando um nó percebe alguma mudança relevante em seus custos/estimativas, ele envia aos vizinhos seu vetor de distâncias.

Esse vetor contém estimativas do custo até os destinos:

$$
D_x(y).
$$

### Passo 2 — atualização pelos vizinhos

Cada vizinho recebe as estimativas e recalcula seus próprios valores.

Depois, se houver mudança, também envia seu vetor atualizado aos seus vizinhos.

Assim, o processo se repete.

Portanto:

$$
\boxed{
\text{Distance Vector}
\Rightarrow
\text{informação distribuída entre vizinhos}
}
$$

> **Referência:** Kurose & Ross, 8ª ed., Seção 5.2.2.

---

## Paradigma dos algoritmos

Nas anotações, os algoritmos são associados aos seguintes paradigmas:

| Algoritmo | Paradigma |
|---|---|
| Dijkstra | Guloso (*Greedy*) |
| Bellman-Ford | Programação Dinâmica |

### Dijkstra — estratégia gulosa

Dijkstra escolhe, em cada passo, o nó ainda não finalizado com menor custo conhecido.

Essa escolha é considerada definitiva.

### Bellman-Ford — programação dinâmica

Bellman-Ford utiliza resultados parciais dos vizinhos para construir uma estimativa melhor.

A relação fundamental é:

$$
\boxed{
D_x(y)
=
\min_{v\in N(x)}
\left\{
c(x,v)+D_v(y)
\right\}
}
$$

onde:

- $x$: nó atual;
- $y$: destino;
- $v$: vizinho de $x$;
- $c(x,v)$: custo de $x$ até $v$;
- $D_v(y)$: estimativa do vizinho $v$ até $y$.

---

## Intra-AS e Inter-AS

Nas anotações aparece uma associação entre:

- Dijkstra / Link State e **intra-AS**;
- Bellman-Ford / Distance Vector e **inter-AS**.

Essa associação deve ser entendida com cuidado.

### OSPF

O principal exemplo estudado de Link State é o:

**OSPF — Open Shortest Path First**

que é utilizado para roteamento:

$$
\boxed{
\text{intra-AS}
}
$$

e utiliza Dijkstra.

### BGP

Para roteamento:

$$
\boxed{
\text{inter-AS}
}
$$

o protocolo utilizado na Internet é o:

**BGP — Border Gateway Protocol**

O BGP possui características de algoritmos distribuídos semelhantes ao Distance Vector, mas é mais precisamente classificado como **Path Vector**.

Portanto:

$$
\boxed{
\text{OSPF}
\rightarrow
\text{Link State}
\rightarrow
\text{Dijkstra}
}
$$

e:

$$
\boxed{
\text{BGP}
\rightarrow
\text{Path Vector}
\rightarrow
\text{inter-AS}
}
$$

> **Observação:** Bellman-Ford é a base matemática do Distance Vector, mas BGP não deve ser tratado simplesmente como “Bellman-Ford puro”.

---

## Visão clássica × SDN no plano de controle

A aula também retoma a diferença entre as duas arquiteturas de plano de controle.

### Visão clássica

Na arquitetura tradicional, cada roteador possui:

- plano de dados;
- plano de controle.

Assim:

```text
Roteador
├── Plano de Controle
└── Plano de Dados
```

Cada roteador executa sua lógica de roteamento localmente.

### SDN

No SDN, o plano de controle é separado dos dispositivos do plano de dados.

De forma simplificada:

```text
          Controlador
              |
     ---------------------
     |         |         |
     v         v         v
  Switch    Switch    Switch
```

O controlador possui uma visão global da rede e instala regras nos dispositivos.

### Relação com os capítulos

Nas anotações:

- **Capítulo 4** → Plano de Dados;
- **Capítulo 5** → Plano de Controle.

---

## Classificação dos algoritmos de roteamento

Além da classificação Link State × Distance Vector, os algoritmos também podem ser classificados em outras dimensões.

### Global × descentralizado

**Global.**

O algoritmo possui informação completa da rede.

Exemplo:

$$
\boxed{
\text{Dijkstra / Link State}
}
$$

**Descentralizado.**

Cada nó conhece apenas informações locais e aprende gradualmente por meio de seus vizinhos.

Exemplo:

$$
\boxed{
\text{Bellman-Ford / Distance Vector}
}
$$

### Estático × dinâmico

Um algoritmo pode ser:

- **estático**: rotas mudam lentamente;
- **dinâmico**: rotas podem mudar em resposta a alterações na topologia ou nos custos.

> **Observação:** Dijkstra e Bellman-Ford são algoritmos de cálculo de caminhos. O fato de uma implementação ser mais estática ou dinâmica depende de como os custos e atualizações são utilizados pelo protocolo.

---

## Problemas quando os custos mudam

Nas anotações aparece uma observação importante sobre alterações dos pesos dos enlaces.

### Dijkstra

Como todos os nós mantêm uma visão global da rede, uma mudança de custo precisa ser divulgada.

Depois disso, os roteadores podem recalcular seus menores caminhos.

### Bellman-Ford

No Distance Vector, a mudança é propagada gradualmente entre vizinhos.

Isso pode causar:

- convergência mais lenta;
- estados temporariamente inconsistentes;
- loops;
- problema de **count-to-infinity**.

O Kurose destaca que, em Distance Vector:

> boas notícias tendem a se propagar rapidamente, enquanto más notícias podem se propagar lentamente.

---

## Informação global no Dijkstra

Uma diferença fundamental destacada na aula é que o Dijkstra utiliza conhecimento global.

Para isso, os custos dos enlaces são divulgados pela rede.

Assim:

$$
\boxed{
\text{cada nó divulga informações locais}
\Rightarrow
\text{todos obtêm uma visão global}
}
$$

Esse modelo funciona dentro de um domínio de roteamento controlado, mas não seria adequado imaginar todos os roteadores da Internet compartilhando globalmente toda a topologia entre si.

Essa é uma das razões para organizar a Internet em:

$$
\boxed{
\text{Autonomous Systems — AS}
}
$$

---

# Algoritmo de Dijkstra

## Notação

Considere uma origem:

$$
u.
$$

### $c(u,v)$

Representa o custo direto do enlace entre $u$ e $v$:

$$
\boxed{
c(u,v)
}
$$

### $D(v)$

Representa o menor custo atualmente conhecido da origem $u$ até o nó $v$:

$$
\boxed{
D(v)
}
$$

### $p(v)$

Representa o predecessor de $v$ no caminho atualmente conhecido:

$$
\boxed{
p(v)
}
$$

Podemos pensar nele como o “pai” de $v$ na árvore de menor custo.

### $N'$

É o conjunto de nós para os quais o menor caminho a partir da origem já foi determinado definitivamente.

$$
\boxed{
N'
=
\{\text{nós cujo menor custo já é definitivo}\}
}
$$

> **Referência:** Kurose & Ross, 8ª ed., Seção 5.2.1, pp. 383–385.

---

## Atualização no Dijkstra

Se $w$ foi o nó escolhido no passo atual, para cada vizinho $v$ ainda não finalizado fazemos:

$$
\boxed{
D(v)
=
\min
\left\{
D(v),
D(w)+c(w,v)
\right\}
}
$$

A interpretação é:

- manter o custo já conhecido para $v$;
- ou passar por $w$;
- escolher o menor.

---

## Visão do Dijkstra

Na visão de Dijkstra, podemos pensar:

```text
u ---- caminho conhecido ----> w ----> v
                                c(w,v)
```

Se o caminho passando por $w$ for melhor:

$$
\boxed{
D(v)
=
D(w)+c(w,v)
}
$$

---

## Visão do Bellman-Ford

Bellman-Ford observa o problema pela perspectiva dos vizinhos.

Para sair de $u$ e chegar a $v$:

1. escolhe-se um vizinho $w$;
2. paga-se o custo:

$$
c(u,w);
$$

3. utiliza-se a estimativa do vizinho até o destino:

$$
D_w(v).
$$

Assim:

$$
\boxed{
D_u(v)
=
\min_w
\left\{
c(u,w)+D_w(v)
\right\}
}
$$

Essa é a equação de Bellman-Ford.

---

# Exemplo de Dijkstra

A segunda página apresenta o mesmo grafo utilizado no exemplo do Kurose.

Os enlaces são:

$$
c(u,v)=2
$$

$$
c(u,x)=1
$$

$$
c(u,w)=5
$$

$$
c(v,x)=2
$$

$$
c(v,w)=3
$$

$$
c(x,w)=3
$$

$$
c(x,y)=1
$$

$$
c(w,y)=1
$$

$$
c(w,z)=5
$$

$$
c(y,z)=2
$$

Uma representação aproximada é:

```text
          2
      u ------- v
      |\       /|
    5 | \1   2/ |3
      |  \   /  |
      |    x----w
      |     \3 /|
      |      \ /1
      |       y
      |       |
      |       |2
      |       |
      +------ z
          5
```

> **Observação:** o desenho acima é apenas esquemático; os custos listados são a referência principal.

---

## Execução passo a passo

Tomando:

$$
u
$$

como origem.

### Passo 0 — inicialização

Inicialmente:

$$
N'=\{u\}.
$$

Para os vizinhos diretos:

$$
D(v)=2,\qquad p(v)=u
$$

$$
D(x)=1,\qquad p(x)=u
$$

$$
D(w)=5,\qquad p(w)=u
$$

Como $y$ e $z$ não são vizinhos diretos:

$$
D(y)=\infty
$$

$$
D(z)=\infty.
$$

Tabela:

| Passo | $N'$ | $D(v),p(v)$ | $D(w),p(w)$ | $D(x),p(x)$ | $D(y),p(y)$ | $D(z),p(z)$ |
|---|---|---|---|---|---|---|
| 0 | $u$ | $2,u$ | $5,u$ | $1,u$ | $\infty$ | $\infty$ |

### Passo 1 — escolhe $x$

O menor custo ainda não definitivo é:

$$
D(x)=1.
$$

Logo:

$$
N'=\{u,x\}.
$$

Atualizando os vizinhos de $x$:

Para $w$:

$$
D(w)
=
\min\{5,1+3\}
=
4.
$$

Logo:

$$
D(w)=4,\qquad p(w)=x.
$$

Para $y$:

$$
D(y)
=
\min\{\infty,1+1\}
=
2.
$$

Logo:

$$
D(y)=2,\qquad p(y)=x.
$$

A tabela fica:

| Passo | $N'$ | $D(v),p(v)$ | $D(w),p(w)$ | $D(x),p(x)$ | $D(y),p(y)$ | $D(z),p(z)$ |
|---|---|---|---|---|---|---|
| 0 | $u$ | $2,u$ | $5,u$ | $1,u$ | $\infty$ | $\infty$ |
| 1 | $ux$ | $2,u$ | $4,x$ | — | $2,x$ | $\infty$ |

### Passo 2 — escolhe $y$

Temos empate:

$$
D(v)=2
$$

e:

$$
D(y)=2.
$$

O exemplo escolhe $y$.

Assim:

$$
N'=\{u,x,y\}.
$$

Atualizando:

Para $w$:

$$
D(w)
=
\min\{4,2+1\}
=
3.
$$

Logo:

$$
D(w)=3,\qquad p(w)=y.
$$

Para $z$:

$$
D(z)
=
\min\{\infty,2+2\}
=
4.
$$

Logo:

$$
D(z)=4,\qquad p(z)=y.
$$

### Passo 3 — escolhe $v$

O menor custo restante é:

$$
D(v)=2.
$$

Assim:

$$
N'=\{u,x,y,v\}.
$$

Nenhuma atualização produz custo menor.

### Passo 4 — escolhe $w$

Agora:

$$
D(w)=3.
$$

Logo:

$$
N'=\{u,x,y,v,w\}.
$$

Para $z$:

$$
D(z)
=
\min\{4,3+5\}
=
4.
$$

Não há alteração.

### Passo 5 — escolhe $z$

Por fim:

$$
D(z)=4.
$$

Então:

$$
N'=\{u,x,y,v,w,z\}.
$$

O algoritmo termina.

---

## Tabela completa

| Passo | $N'$ | $D(v),p(v)$ | $D(w),p(w)$ | $D(x),p(x)$ | $D(y),p(y)$ | $D(z),p(z)$ |
|---|---|---|---|---|---|---|
| 0 | $u$ | $2,u$ | $5,u$ | $1,u$ | $\infty$ | $\infty$ |
| 1 | $ux$ | $2,u$ | $4,x$ | — | $2,x$ | $\infty$ |
| 2 | $uxy$ | $2,u$ | $3,y$ | — | — | $4,y$ |
| 3 | $uxyv$ | — | $3,y$ | — | — | $4,y$ |
| 4 | $uxyvw$ | — | — | — | — | $4,y$ |
| 5 | $uxyvwz$ | — | — | — | — | — |

Os menores custos a partir de $u$ são:

$$
\boxed{
D(x)=1
}
$$

$$
\boxed{
D(v)=2
}
$$

$$
\boxed{
D(y)=2
}
$$

$$
\boxed{
D(w)=3
}
$$

$$
\boxed{
D(z)=4
}
$$

---

## Por que Dijkstra funciona?

Nas anotações aparece a ideia de uma prova por contradição.

A propriedade central é:

> quando o algoritmo escolhe o nó $w$ com menor $D(w)$ entre os nós ainda não finalizados, esse valor já corresponde ao menor custo verdadeiro até $w$.

A intuição depende da hipótese de custos de enlace não negativos.

Se existisse um caminho mais barato para $w$ passando por algum nó ainda não escolhido, esse caminho teria de chegar primeiro a algum nó não finalizado com custo ainda menor que $D(w)$.

Mas isso contradiz a escolha de $w$ como o nó de menor custo entre os não finalizados.

Assim, quando $w$ entra em:

$$
N',
$$

seu menor custo pode ser considerado definitivo.

---

## Complexidade do Dijkstra

Nas anotações aparece a observação:

> a escolha de $w$, se feita de forma ingênua, exige procurar entre os nós ainda não escolhidos.

Na implementação básica apresentada pelo Kurose:

$$
\boxed{
O(V^2)
}
$$

pois, a cada passo, é feita uma busca entre os nós restantes.

Com estruturas de dados mais adequadas, como uma fila de prioridade/heap, a implementação pode ser melhorada.

Uma forma usual de expressar essa complexidade é:

$$
\boxed{
O((V+E)\log V)
}
$$

e, para grafos conectados, frequentemente:

$$
O(E\log V).
$$

> **Observação:** na anotação aparece uma simplificação levando a algo como $O(n\log n)$. A complexidade exata depende da estrutura de dados e da representação do grafo. O Kurose afirma explicitamente $O(V^2)$ para a implementação básica.

---

# Distance Vector — próximo tópico

A aula termina indicando a continuação com:

> **Distance Vector — Equação de Bellman-Ford**

A relação central será:

$$
\boxed{
D_x(y)
=
\min_{v\in N(x)}
\left\{
c(x,v)+D_v(y)
\right\}
}
$$

A diferença fundamental em relação ao Link State será que cada nó:

- não terá a visão completa da rede;
- trocará informações apenas com seus vizinhos;
- atualizará iterativamente suas estimativas.

---

## Resumo

Os principais tópicos desta aula foram:

- continuação do Capítulo 5;
- comparação Dijkstra × Bellman-Ford;
- Link State × Distance Vector;
- paradigma guloso × programação dinâmica;
- visão global × distribuída;
- arquitetura clássica × SDN no plano de controle;
- custos de enlace;
- $D(v)$;
- $p(v)$;
- $N'$;
- atualização de Dijkstra:

$$
D(v)
=
\min\{D(v),D(w)+c(w,v)\};
$$

- equação de Bellman-Ford:

$$
D_x(y)
=
\min_v\{c(x,v)+D_v(y)\};
$$

- exemplo completo do algoritmo de Dijkstra;
- justificativa intuitiva do algoritmo;
- complexidade:
  - implementação básica: $O(V^2)$;
  - implementação com heap: melhor desempenho;
- introdução à continuação com Distance Vector.
