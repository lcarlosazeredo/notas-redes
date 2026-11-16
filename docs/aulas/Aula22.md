# Aula 22 — 06/11/2026

> **Base principal:** anotações manuscritas da aula.  
> **Complementos:** *Computer Networking: A Top-Down Approach*, 8ª ed., Kurose & Ross, principalmente Capítulo 4 (IPv6, generalized forwarding, middleboxes) e Capítulo 5 (algoritmos de roteamento, OSPF e BGP).  
> Quando a anotação manuscrita está abreviada ou conceitualmente imprecisa, o complemento/correção é indicado.

## Organização da aula

A aula faz a transição entre:

- fim do **Capítulo 4 — Camada de Rede: Data Plane**;
- início do **Capítulo 5 — Camada de Rede: Control Plane**.

Os principais tópicos foram:

- transição IPv4 → IPv6;
- tunneling;
- IPsec e VPN;
- generalized forwarding;
- middleboxes;
- SDN;
- introdução aos algoritmos de roteamento;
- Dijkstra;
- Bellman-Ford / Distance Vector;
- OSPF e BGP.

---

## IPv4, IPv6 e transição entre versões

### Núcleo da rede e simplicidade

Nas anotações aparece a ideia de que o núcleo da rede foi originalmente pensado para ser relativamente simples.

Funções mais complexas surgem com mecanismos como:

- NAT;
- firewall;
- middleboxes;
- VPNs.

Esses elementos passam a executar ações além do simples encaminhamento de datagramas.

> **Complemento do Kurose:** o livro destaca que middleboxes rompem parcialmente a separação arquitetural tradicional, pois podem examinar e modificar campos de diferentes camadas.

---

### Escassez de endereços IPv4

A pergunta anotada foi:

> **Como lidar com a escassez de endereços IP?**

Duas respostas principais foram destacadas:

$$
\boxed{
\text{NAT}
}
$$

e:

$$
\boxed{
\text{IPv6}
}
$$

O NAT prolonga a utilização do espaço de endereços IPv4.

O IPv6, por outro lado, amplia estruturalmente o espaço de endereçamento.

---

### Compatibilidade entre IPv4 e IPv6

Um dos problemas da migração é que a Internet não pode simplesmente substituir todos os dispositivos IPv4 por IPv6 de uma única vez.

Durante a transição, existem:

- dispositivos IPv4;
- dispositivos IPv6;
- redes que suportam ambos.

Por isso, são necessários mecanismos de compatibilidade.

---

### Tunneling

Nas anotações aparece o **tunneling** como mecanismo para permitir que tráfego IPv6 atravesse uma região IPv4.

A ideia é encapsular um datagrama IPv6 dentro de um datagrama IPv4.

De forma simplificada:

```text
IPv6
 |
 | encapsulamento
 v
IPv4
 |
 | atravessa rede IPv4
 v
IPv4
 |
 | desencapsulamento
 v
IPv6
```

Assim, logicamente temos:

$$
\boxed{
\text{IPv6}
\rightarrow
\text{túnel IPv4}
\rightarrow
\text{IPv6}
}
$$

No exemplo do Kurose, o datagrama IPv6 é transportado como payload de um datagrama IPv4.

O campo `Protocol` do IPv4 pode indicar que o payload contém um datagrama IPv6.

> **Referência:** Kurose & Ross, 8ª ed., Seção 4.3.4, Figura 4.27.

**O que caracteriza o túnel?**

A anotação pergunta:

> **O que existe em comum entre esses casos?**

A resposta registrada é:

> **Tunnel.**

Em todos os casos, uma unidade de protocolo é encapsulada dentro de outra para atravessar uma região da rede que não oferece diretamente o protocolo original.

---

### Adoção do IPv6

Nas anotações aparece uma observação de que a implantação do IPv6 ocorre de forma gradual e lenta.

Isso reforça a necessidade de mecanismos de transição.

> **Observação:** há uma anotação com um percentual de adoção de IPv6 em determinado ano, mas o valor é circunstancial e foi mantido apenas como comentário de aula, não como dado atualizado.

---

### IPsec e VPN

### IPsec

Nas anotações aparece:

**IPsec**

relacionado à segurança na camada de rede.

IPsec pode fornecer mecanismos como:

- confidencialidade;
- autenticação da origem;
- integridade;
- proteção contra replay.

O objetivo é proteger tráfego IP independentemente da aplicação utilizada.

---

### VPN — Virtual Private Network

VPN significa:

**Virtual Private Network**.

A ideia é utilizar uma infraestrutura pública, como a Internet, para criar uma comunicação que se comporte como uma rede privada.

De forma simplificada:

```text
Rede A
  |
Gateway
  |
  |==== túnel protegido pela Internet ====|
                                      Gateway
                                         |
                                       Rede B
```

O tráfego entre as redes pode ser:

- encapsulado;
- autenticado;
- criptografado.

**Relação entre IPsec, VPN e tunneling.**

Os três conceitos podem aparecer juntos:

- **tunneling**: encapsula o tráfego;
- **IPsec**: fornece proteção ao tráfego IP;
- **VPN**: utiliza esses mecanismos para criar uma rede privada lógica sobre uma rede pública.

> **Referência:** Kurose & Ross, 8ª ed., Seção 8.7.

---

## Generalized Forwarding

### Flow Table Abstraction

A aula retoma a abstração de **flow table**.

Em generalized forwarding, uma regra pode ser expressa de forma conceitual como:

$$
\boxed{
\text{match}
\rightarrow
\text{action}
}
$$

As ações anotadas incluem:

- `forward`;
- `drop`;
- `send to controller`.

**Forward e Drop.**

Ações como:

- encaminhar;
- descartar;

podem ser realizadas diretamente no plano de dados.

Por isso, são operações rápidas.

**Send to Controller.**

Em alguns casos, um pacote pode ser enviado ao controlador.

Essa operação é mais lenta, pois envolve comunicação com o plano de controle.

Assim:

$$
\boxed{
\text{forward/drop}
\rightarrow
\text{mais rápido}
}
$$

e:

$$
\boxed{
\text{send to controller}
\rightarrow
\text{mais lento}
}
$$

---

### Campos utilizados no match

No forwarding tradicional, o principal campo utilizado é:

$$
\text{Destination IP}.
$$

No generalized forwarding, podem ser usados vários campos.

Por exemplo:

- IP de origem;
- IP de destino;
- protocolo;
- porta TCP/UDP de origem;
- porta TCP/UDP de destino.

**NAT como exemplo.**

Para implementar NAT, não basta observar apenas:

- IP origem;
- IP destino.

Também é necessário, em muitos casos, considerar:

- porta de origem;
- porta de destino.

Assim, o generalized forwarding oferece a flexibilidade necessária para implementar funções mais complexas.

---

## Middleboxes

Middleboxes são dispositivos que realizam funções além do encaminhamento IP tradicional.

Exemplos citados ou relacionados às anotações:

- NAT;
- firewall;
- balanceador de carga;
- dispositivos de segurança;
- proxies.

Esses dispositivos podem:

- modificar cabeçalhos;
- bloquear pacotes;
- redirecionar tráfego;
- distribuir carga.

**Exemplos.**

**Firewall.**

Pode decidir:

$$
\text{match}
\rightarrow
\text{drop}
$$

**NAT.**

Pode realizar:

$$
\text{match}
\rightarrow
\text{reescrever endereço/porta}
$$

**Load Balancer.**

Pode escolher entre vários servidores de destino.

> **Referência:** Kurose & Ross, 8ª ed., Seção 4.5.

---

## SDN — Software-Defined Networking

A ideia central do SDN é separar mais claramente:

- plano de dados;
- plano de controle.

Nas anotações:

> implementar um dispositivo responsável pelo plano de controle: **o controlador**.

De forma simplificada:

```text
          Controlador SDN
             |
      -------------------
      |        |        |
      v        v        v
   Switch    Switch    Switch
```

O controlador possui uma visão mais global da rede e instala regras nos dispositivos do plano de dados.

**Implementações.**

Foi citado em aula o uso de SDN em redes de grande escala, como redes do Google.

O ponto principal é que o controle centralizado logicamente permite tomar decisões considerando uma visão ampla da rede.

> **Observação:** o SDN possui controle **logicamente centralizado**, mas a implementação física do controlador pode ser distribuída.

---

## Fim do Capítulo 4

A aula marca o encerramento dos principais tópicos do Capítulo 4:

- forwarding;
- arquitetura interna de roteadores;
- IPv4;
- NAT;
- IPv6;
- generalized forwarding;
- SDN;
- middleboxes.

---

## Capítulo 5 — Camada de Rede: Control Plane

O foco passa agora a ser:

> **Como calcular os caminhos utilizados pela rede?**

Isso é um problema de:

$$
\boxed{
\text{roteamento}
}
$$

---

## Problema de caminho de menor custo

Uma rede pode ser representada por um grafo:

$$
G=(V,E),
$$

onde:

- $V$: conjunto de nós/roteadores;
- $E$: conjunto de enlaces.

Cada enlace possui um custo:

$$
c(u,v).
$$

O objetivo é encontrar um caminho entre origem e destino com menor custo total.

Se o caminho é:

$$
(v_0,v_1,\ldots,v_k),
$$

seu custo é:

$$
\boxed{
\sum_{i=0}^{k-1}c(v_i,v_{i+1})
}
$$

---

### Caso sem pesos

Se todos os enlaces possuem o mesmo custo, o problema se reduz a encontrar o caminho com menor número de saltos.

Nesse caso, algoritmos como busca em largura podem ser utilizados.

---

## Dijkstra

Nas anotações:

> **Dijkstra → algoritmo guloso.**

O algoritmo de Dijkstra utiliza informação global da topologia.

Ele conhece:

- os nós;
- os enlaces;
- os custos dos enlaces.

Por isso, é associado a algoritmos de:

**Link State — LS**

---

### Ideia gulosa

A cada passo, Dijkstra escolhe o nó ainda não finalizado com menor custo conhecido a partir da origem.

Essa escolha é considerada definitiva.

Assim, o algoritmo constrói a solução de forma incremental.

A anotação resume a ideia como:

> sempre tomar como próximo passo o menor custo já conhecido.

---

### Estruturas conceituais

Seja:

$$
D(v)
$$

o menor custo atualmente conhecido da origem até $v$.

Quando um novo nó $w$ é incorporado ao conjunto de nós já resolvidos, os vizinhos são atualizados por:

$$
\boxed{
D(v)
=
\min
\left(
D(v),
D(w)+c(w,v)
\right)
}
$$

Esse procedimento continua até determinar os menores caminhos.

---

### Informação utilizada pelo Dijkstra

O algoritmo possui informação global:

- conectividade entre todos os nós;
- custo dos enlaces.

Essa informação precisa ser disponibilizada aos roteadores.

Em protocolos Link State, isso ocorre por meio da divulgação de informações de estado dos enlaces.

---

### Complexidade

A implementação básica apresentada pelo Kurose possui complexidade:

$$
\boxed{
O(V^2)
}
$$

para $V$ nós.

O livro observa que implementações mais sofisticadas, usando estruturas como heap, podem melhorar esse custo.

> **Correção:** na anotação manuscrita aparece uma expressão de complexidade acompanhada de ponto de interrogação. Para a implementação do Dijkstra apresentada no Kurose, a complexidade explicitamente indicada é $O(V^2)$.

**Referência:** Kurose & Ross, 8ª ed., Seção 5.2.1, p. 386.

---

## Bellman-Ford

O segundo algoritmo trabalhado é baseado na equação de:

**Bellman-Ford**.

Ele está associado à abordagem:

**Distance Vector — DV**

Diferentemente de Dijkstra, um nó não precisa possuir a topologia completa da rede.

Cada nó começa conhecendo principalmente:

- seus vizinhos;
- o custo dos enlaces diretamente conectados.

Em seguida, os nós trocam informações com seus vizinhos.

---

### Equação de Bellman-Ford

Se:

$$
d_x(y)
$$

é o menor custo do nó $x$ até o destino $y$, então:

$$
\boxed{
d_x(y)
=
\min_{v\in N(x)}
\left\{
c(x,v)+d_v(y)
\right\}
}
$$

onde:

- $N(x)$ é o conjunto de vizinhos de $x$;
- $c(x,v)$ é o custo imediato de ir de $x$ até o vizinho $v$;
- $d_v(y)$ é o custo estimado do vizinho $v$ até o destino $y$.

Podemos interpretar como:

$$
\boxed{
\text{custo imediato}
+
\text{cost-to-go}
}
$$

---

### Cost-to-go

A anotação destaca a ideia de:

> **cost-to-go**

Isto é, quanto ainda falta pagar, em termos de custo, para alcançar o destino depois de tomar determinada decisão.

No Bellman-Ford:

1. escolhe-se um vizinho possível;
2. soma-se:
   - o custo para chegar a esse vizinho;
   - o custo estimado desse vizinho até o destino;
3. escolhe-se o menor valor.

Essa ideia também aparece em outros problemas de otimização e programação dinâmica.

---

**Dijkstra.** × Bellman-Ford

### Informação disponível

A comparação feita em aula pode ser organizada assim:

| Característica | Dijkstra / Link State | Bellman-Ford / Distance Vector |
|---|---|---|
| Informação inicial | Topologia e custos globais | Custos para vizinhos |
| Com quem troca informações | Informação é difundida pela rede | Apenas com vizinhos |
| Informação disponível ao nó | Custos de todos os enlaces | Vetores de distância dos vizinhos |
| Forma de cálculo | Global | Distribuída |
| Evolução | Calcula a partir do mapa completo | Melhora estimativas iterativamente |

#**Dijkstra.**

Cada nó possui um mapa da topologia e calcula localmente os menores caminhos.

#**Bellman-Ford.**

Cada nó troca seu vetor de distâncias com seus vizinhos.

Quando recebe novas informações:

$$
D_x(y)
=
\min_v
\left\{
c(x,v)+D_v(y)
\right\}.
$$

Se o vetor mudar, ele pode ser enviado novamente aos vizinhos.

---

### Centralizado × distribuído

**Link State.**

O algoritmo é considerado **centralizado em termos de informação** porque utiliza conhecimento global da topologia.

Isso não significa necessariamente que exista somente uma máquina calculando.

Cada roteador pode possuir uma cópia do mapa e executar Dijkstra localmente.

**Distance Vector.**

É:

- distribuído;
- iterativo;
- assíncrono.

Os nós atualizam seus valores conforme recebem informações dos vizinhos.

> **Referência:** Kurose & Ross, 8ª ed., Seções 5.2.1 e 5.2.2.

---

## Convergência

Nas anotações aparece uma preocupação com:

> **problema de convergência**

em algoritmos do tipo Bellman-Ford / Distance Vector.

Como a informação é propagada gradualmente entre vizinhos, uma mudança na rede não é conhecida imediatamente por todos os roteadores.

Podem ocorrer situações em que:

- diferentes roteadores possuem temporariamente informações diferentes;
- a atualização leva várias rodadas;
- podem ocorrer loops temporários.

Um problema clássico estudado posteriormente é:

**count-to-infinity**.

---

## OSPF

Nas anotações, Dijkstra é associado ao:

**OSPF — Open Shortest Path First**

O OSPF é um protocolo:

- **intra-AS**;
- baseado em **Link State**;
- que utiliza o algoritmo de Dijkstra.

Em OSPF:

1. os roteadores divulgam informações de estado dos enlaces;
2. cada roteador constrói um mapa da topologia do AS;
3. executa Dijkstra localmente;
4. constrói sua tabela de forwarding.

$$
\boxed{
\text{OSPF}
\rightarrow
\text{Link State}
\rightarrow
\text{Dijkstra}
}
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 5.3.

---

## BGP

Nas anotações, Bellman-Ford aparece associado ao:

**BGP — Border Gateway Protocol**

e ao roteamento:

**inter-AS**.

Essa associação é útil como aproximação, mas precisa de uma precisão conceitual.

### Correção importante

O BGP não é simplesmente uma implementação direta do algoritmo de Bellman-Ford.

O Kurose descreve o BGP como um protocolo:

- distribuído;
- assíncrono;
- com características relacionadas a Distance Vector;
- mais precisamente classificado como **Path Vector**.

Além do custo, o BGP considera:

- sequência de ASs;
- políticas;
- atributos das rotas.

Assim:

$$
\boxed{
\text{BGP}
\neq
\text{Bellman-Ford puro}
}
$$

mas há uma relação conceitual com algoritmos distribuídos do tipo Distance Vector.

---

**Intra-AS.** × Inter-AS

| Protocolo | Uso |
|---|---|
| OSPF | Intra-AS |
| BGP | Inter-AS |

**Intra-AS.**

Roteamento dentro de um mesmo Sistema Autônomo.

**Inter-AS.**

Roteamento entre Sistemas Autônomos diferentes.

---

## Comparação resumida

| Característica | Dijkstra / LS | Bellman-Ford / DV |
|---|---|---|
| Conhecimento | Global | Local + vizinhos |
| Troca | Estado dos links | Vetores de distância |
| Comunicação | Informação difundida amplamente | Entre vizinhos |
| Execução | Local sobre mapa global | Distribuída e iterativa |
| Exemplo de protocolo | OSPF | Base conceitual para DV |
| Escopo típico citado | Intra-AS | Algoritmos distribuídos |

E, no contexto da Internet:

| Protocolo | Tipo | Escopo |
|---|---|---|
| OSPF | Link State | Intra-AS |
| BGP | Path Vector | Inter-AS |

---

## Observações da aula

As anotações também destacam:

- problemas de caminho mais curto aparecem frequentemente em exercícios pequenos;
- os exemplos podem ser resolvidos manualmente para poucos nós;
- o foco é entender:
  - como o algoritmo evolui;
  - quais informações cada nó conhece;
  - quais informações são trocadas;
  - como a tabela de forwarding é construída.

---

## Resumo

Os principais tópicos desta aula foram:

- transição IPv4 → IPv6;
- escassez de endereços IPv4;
- tunneling;
- IPv6 sobre infraestrutura IPv4;
- IPsec;
- VPN;
- generalized forwarding;
- flow tables;
- ações:
  - forward;
  - drop;
  - send to controller;
- NAT, firewall e load balancing como funções de middleboxes;
- SDN;
- fim do Capítulo 4;
- início do Capítulo 5;
- representação da rede por grafos;
- problema de menor custo;
- Dijkstra;
- algoritmo Link State;
- Bellman-Ford;
- algoritmo Distance Vector;
- cost-to-go;
- informação global × informação local;
- convergência;
- OSPF;
- BGP;
- intra-AS × inter-AS;
- correção conceitual: BGP é Path Vector, não Bellman-Ford puro.
