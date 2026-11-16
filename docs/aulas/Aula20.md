# Aula 20 — 28/10/2026

> **Base principal:** anotações manuscritas da aula.  
> **Complementos:** *Computer Networking: A Top-Down Approach*, 8ª ed., Kurose & Ross, principalmente Capítulo 4, Seções 4.2–4.4.  
> Os complementos abaixo servem apenas para esclarecer os tópicos efetivamente trabalhados em sala.

## Retomada da aula anterior

Na aula anterior:

- começamos o **Capítulo 4 — Camada de Rede**;
- discutimos a separação entre:
  - **plano de controle**;
  - **plano de dados**;
- comparamos:
  - arquitetura **clássica**;
  - arquitetura **SDN**.

### Aula de hoje

O objetivo é continuar o Capítulo 4 e responder:

> **Como funciona um roteador?**

---

## Arquitetura clássica × SDN

### Arquitetura clássica

Na abordagem tradicional, cada roteador possui tanto funções do plano de controle quanto do plano de dados.

Podemos representar:

```text
Roteador 1      Roteador 2      Roteador 3
   |               |               |
   | routing       | routing       | routing
   |---------------|---------------|
   | forwarding    | forwarding    | forwarding
```

Nas anotações:

- **Plano de Controle**:
  - routing;
  - associado ao Capítulo 5;
- **Plano de Dados**:
  - forwarding;
  - associado ao Capítulo 4.

No modelo clássico, os próprios roteadores:

- executam protocolos de roteamento;
- trocam informações entre si;
- calculam suas tabelas;
- encaminham os pacotes.

### SDN

No **Software-Defined Networking (SDN)**, a lógica de controle é separada dos dispositivos responsáveis pelo encaminhamento.

De forma simplificada:

```text
            Controlador SDN
            /     |      \
           /      |       \
          v       v        v
      Switch 1  Switch 2  Switch 3
```

O controlador é **logicamente centralizado**.

Ele pode:

- calcular regras;
- instalar regras;
- atualizar tabelas nos dispositivos do plano de dados.

Os switches/roteadores do plano de dados continuam executando o encaminhamento rapidamente.

> **Complemento do Kurose:** “logicamente centralizado” não significa necessariamente um único servidor físico. O controlador pode ser implementado de forma distribuída, mas oferece uma visão lógica centralizada da rede.

---

## Plano de Dados × Plano de Controle

### Plano de Dados

O plano de dados executa o **forwarding**.

Sua função é local e precisa ser extremamente rápida:

> dado um pacote que chegou, para qual porta de saída ele deve ir?

Em roteadores de alta velocidade, essa operação acontece em escalas muito pequenas de tempo e normalmente é implementada em hardware.

### Plano de Controle

O plano de controle determina:

- caminhos;
- regras;
- tabelas de encaminhamento.

Ele opera em uma escala de tempo muito maior do que o plano de dados.

O Kurose destaca aproximadamente:

- plano de dados: escala de nanossegundos;
- plano de controle: escala de milissegundos ou segundos.

Portanto:

$$
\boxed{
\text{Plano de dados}
\rightarrow
\text{rápido e local}
}
$$

$$
\boxed{
\text{Plano de controle}
\rightarrow
\text{lógica de rede}
}
$$

---

## Forwarding clássico × Generalized Forwarding

Nas anotações aparece a comparação:

- **SDN:** *Generalized Forwarding*;
- **clássico:** encaminhamento principalmente pelo **IP de destino**.

### Destination-Based Forwarding

No encaminhamento tradicional, o roteador analisa principalmente:

$$
\boxed{
\text{Destination IP Address}
}
$$

e usa a tabela de forwarding para escolher a porta de saída.

De forma simplificada:

```text
IP de destino
     |
     v
Tabela de forwarding
     |
     v
Porta de saída
```

### Generalized Forwarding

No **Generalized Forwarding**, a decisão pode utilizar vários campos dos cabeçalhos.

Isso segue a ideia:

$$
\boxed{
\text{match}+\text{action}
}
$$

O *match* pode considerar campos de:

- camada de enlace;
- camada de rede;
- camada de transporte.

E a ação pode ser, por exemplo:

- encaminhar;
- descartar;
- modificar campos;
- enviar para múltiplas portas;
- aplicar balanceamento de carga.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.4.

---

## Granularidade das regras

Uma vantagem do generalized forwarding é poder usar informações mais específicas do pacote.

No encaminhamento clássico, uma regra pode ser algo como:

```text
Destino IP -> porta de saída
```

Já em uma regra generalizada podemos combinar diferentes campos.

Exemplo conceitual:

```text
IP origem
IP destino
porta TCP/UDP
protocolo
        |
        v
      ação
```

Assim, o SDN/generalized forwarding permite uma granularidade maior na definição das regras.

---

## Prefixos e agregação de endereços

Nas anotações aparecem exemplos de grupos de endereços representados por prefixos binários, associados a regiões como:

- EUA;
- França;
- Europa.

A ideia é não precisar manter uma entrada separada para cada endereço IP existente.

Podemos agrupar destinos que compartilham um prefixo.

Por exemplo:

```text
00010...       -> região A
00011000...    -> região B
00011...       -> região maior
```

Esse tipo de agregação permite reduzir a quantidade de entradas necessárias nas tabelas.

### Longest Prefix Matching

Quando mais de uma entrada pode corresponder ao endereço de destino, utiliza-se a regra do:

**longest prefix matching**.

Isto é:

> escolhe-se a entrada cujo prefixo correspondente ao endereço de destino é o mais longo e, portanto, mais específico.

Essa operação é fundamental no encaminhamento IP.

---

## Protocolos de roteamento e sua implementação

Nas anotações aparece a discussão:

> **BGP usa TCP.**

Isso ajuda a distinguir a função lógica de um protocolo da forma como suas mensagens são transportadas.

O BGP:

- é um **protocolo de roteamento**;
- atua no **plano de controle da camada de rede**;
- utiliza **TCP** para transportar suas mensagens entre roteadores BGP.

Assim, do ponto de vista funcional, BGP pertence ao problema de roteamento da camada de rede, embora sua comunicação utilize serviços de transporte.

Também foi anotado que diferentes protocolos de roteamento podem utilizar mecanismos diferentes para transportar suas mensagens.

---

# Como funciona um roteador?

Um roteador possui quatro componentes principais:

1. **portas de entrada**;
2. **switching fabric**;
3. **portas de saída**;
4. **routing processor**.

De forma simplificada:

```text
        +----------------------+
Entrada |                      | Saída
------> |   Switching Fabric   | ------>
        |                      |
        +----------------------+
                 ^
                 |
          Routing Processor
```

O routing processor executa funções do plano de controle.

As portas e o switching fabric fazem parte principalmente do plano de dados.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.2, Figura 4.4.

---

## Porta de entrada

Quando um pacote chega a uma porta de entrada, podem ocorrer:

- processamento da camada física;
- processamento da camada de enlace;
- consulta à tabela de forwarding;
- enfileiramento, se necessário.

O objetivo principal é determinar:

$$
\boxed{
\text{qual porta de saída deve receber o pacote}
}
$$

Depois disso, o pacote é enviado ao switching fabric.

---

## Switching Fabric

O **switching fabric** conecta internamente as portas de entrada às portas de saída.

Sua função é:

$$
\boxed{
\text{entrada}
\rightarrow
\text{saída correta}
}
$$

### Velocidade do switching fabric

Considere:

- $N$: número de portas de entrada;
- $R$: taxa de cada linha.

No pior caso, podem chegar simultaneamente:

$$
N
$$

pacotes, um por entrada.

Para que praticamente não se forme fila nas portas de entrada, o switching fabric deve ser capaz de transferir pacotes a uma taxa da ordem de:

$$
\boxed{
R_{\text{switch}}
=
N R
}
$$

Se o switching fabric for lento em relação às portas de entrada, pode ocorrer **input queueing**.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.2.4.

---

## Tipos de implementação do switching fabric

O Kurose apresenta três formas principais.

### 1. Switching via memória

O pacote:

1. entra;
2. é copiado para uma memória;
3. o processador determina a saída;
4. o pacote é copiado da memória para a porta de saída.

A memória compartilhada pode se tornar um gargalo.

### 2. Switching via barramento

As portas compartilham um barramento interno.

Somente uma transferência por vez pode utilizar o barramento.

Assim, sua capacidade limita o throughput interno do roteador.

### 3. Switching via rede de interconexão

São utilizadas estruturas como **crossbar**.

Isso permite que diferentes pares de entrada/saída sejam atendidos simultaneamente quando não competem pela mesma saída.

Assim:

```text
Entrada A -> Saída X
Entrada B -> Saída Y
```

podem ocorrer em paralelo.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.2.2.

---

## Atraso dentro do roteador

Podemos retomar os componentes do atraso nodal:

$$
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
$$

Dentro de um roteador, interessam especialmente:

- processamento;
- enfileiramento;
- transferência interna;
- transmissão no enlace de saída.

---

## Filas na entrada

Se o switching fabric não consegue retirar pacotes das entradas com velocidade suficiente, surgem filas nas portas de entrada.

Isso pode provocar o problema de:

**Head-of-Line Blocking — HOL**

Um pacote no início da fila pode impedir o avanço de outro pacote que está atrás dele, mesmo quando a saída desejada pelo segundo pacote está livre.

Exemplo:

```text
Fila de entrada:

[A][B][C]
 ^
 |
 quer uma saída ocupada
```

Se `B` quer outra saída que está livre, ainda assim ele não consegue passar enquanto `A` continuar bloqueando o início da fila.

---

## Filas na saída

Mesmo com um switching fabric muito rápido, podem chegar vários pacotes simultaneamente para a mesma porta de saída.

Exemplo:

```text
Entrada 1 ----\
Entrada 2 -----+--> Saída R
Entrada 3 ----/
```

Se a taxa agregada de chegada à saída for maior que a taxa:

$$
R,
$$

os pacotes precisam esperar em um buffer.

Assim, forma-se uma **output queue**.

---

## Buffer de saída

Nas anotações aparece a relação entre:

- RTT;
- capacidade do enlace $C$;
- quantidade necessária de buffer.

### Regra clássica

Uma regra tradicional para o tamanho do buffer é:

$$
\boxed{
B=RTT\cdot C
}
$$

Esse termo é o **produto delay-banda**.

### Muitas conexões TCP

Se houver:

$$
N
$$

fluxos TCP independentes atravessando a interface, uma regra mais moderna discutida pelo Kurose é:

$$
\boxed{
B
\approx
\frac{RTT\cdot C}{\sqrt{N}}
}
$$

Portanto, quando muitos fluxos independentes compartilham o enlace, pode ser possível utilizar um buffer menor.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.2.4, pp. 323–324.

---

## Output Queueing e escalonamento

Quando vários pacotes estão esperando na porta de saída, é necessário decidir:

> qual pacote será transmitido primeiro?

A política mais simples é:

**FIFO — First In, First Out**

Mas podem existir outras políticas.

### Prioridade

As anotações citam que podemos implementar **prioridades**.

Por exemplo:

- tráfego prioritário;
- tráfego normal.

Uma política de escalonamento pode permitir que uma classe seja atendida antes de outra.

Além de FIFO e prioridade, o Kurose também apresenta outras disciplinas, como:

- Round Robin;
- Weighted Fair Queueing.

---

## Campos usados para tomar decisões

Nas anotações aparecem alguns campos que podem ser úteis para forwarding e generalized forwarding.

### Destination IP Address

É o campo principal no encaminhamento IP tradicional:

$$
\boxed{
\text{Destination IP Address}
}
$$

### Source IP Address

O endereço de origem pode ser usado em regras mais sofisticadas.

No generalized forwarding, por exemplo, podemos distinguir fluxos também pelo IP de origem.

Outros campos podem ser utilizados dependendo da política desejada.

---

# Campos importantes do cabeçalho IP

## TTL — Time To Live

O IPv4 possui o campo:

**TTL — Time To Live**

Apesar do nome, na prática ele funciona como um contador de saltos.

A cada roteador:

$$
TTL
\leftarrow
TTL-1.
$$

Quando:

$$
TTL=0,
$$

o datagrama é descartado.

Isso impede que um pacote fique circulando indefinidamente em caso de loop de roteamento.

No IPv6, o campo equivalente é chamado:

**Hop Limit**.

---

## MTU e fragmentação

Cada enlace possui um limite para o tamanho máximo do quadro que pode transportar.

Esse limite é a:

**MTU — Maximum Transmission Unit**.

Um valor muito comum em Ethernet é:

$$
1500\text{ bytes}.
$$

### Fragmentação no IPv4

Se um datagrama IPv4 for maior que a MTU de um enlace, ele pode precisar ser fragmentado.

O IPv4 possui campos relacionados a esse processo, como:

- Identification;
- Flags;
- Fragment Offset.

Os fragmentos são posteriormente remontados no destino.

### IPv6

No IPv6:

$$
\boxed{
\text{roteadores intermediários não fragmentam datagramas}
}
$$

Se um datagrama IPv6 for grande demais para o próximo enlace:

1. o roteador descarta o datagrama;
2. envia uma mensagem ICMPv6 **Packet Too Big** ao remetente;
3. o remetente envia novamente usando um tamanho adequado.

Essa mudança reduz o processamento necessário nos roteadores.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.3.4, pp. 348–350.

---

## Resumo

Os principais tópicos desta aula foram:

- arquitetura clássica × SDN;
- plano de dados × plano de controle;
- forwarding tradicional;
- generalized forwarding;
- match + action;
- prefixos de endereços;
- longest prefix matching;
- BGP utilizando TCP;
- arquitetura interna de um roteador;
- portas de entrada e saída;
- switching fabric;
- velocidade do switching fabric:

$$
R_{\text{switch}}\approx NR;
$$

- switching:
  - por memória;
  - por barramento;
  - por rede de interconexão;
- filas de entrada;
- HOL blocking;
- filas de saída;
- output queueing;
- dimensionamento de buffers:

$$
B=RTT\cdot C;
$$

e, com muitos fluxos:

$$
B\approx\frac{RTT\cdot C}{\sqrt N};
$$

- FIFO e escalonamento por prioridade;
- Destination IP Address;
- Source IP Address;
- TTL;
- MTU;
- fragmentação IPv4;
- ausência de fragmentação em roteadores IPv6.
