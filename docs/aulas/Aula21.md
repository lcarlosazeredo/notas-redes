# Aula 21 — 04/11/2026

> **Base principal:** anotações manuscritas da aula.  
> **Complementos:** *Computer Networking: A Top-Down Approach*, 8ª ed., Kurose & Ross, principalmente Capítulo 4, Seções 4.3.1–4.3.4.  
> Os complementos abaixo servem apenas para esclarecer os tópicos efetivamente trabalhados em sala.

## Anotação inicial — revisão

No início da página há um esquema temporal relacionado a uma questão/revisão.

O desenho apresenta duas situações em instantes diferentes e uma expressão de tempo, mas essa fórmula não está legível o suficiente para ser transcrita com segurança.

Também aparecem anotações de organização/revisão:

1. revisão de questões/prova;
2. trabalho envolvendo **AIMD**;
3. lista de exercícios dos Capítulos 3 e 4.

---

## IP Datagram Format

A aula retoma o formato do datagrama IP e alguns campos importantes do cabeçalho IPv4.

### ECN

O **ECN — Explicit Congestion Notification** utiliza bits do cabeçalho IP para permitir sinalização explícita de congestionamento.

A ideia é permitir que um roteador indique congestionamento sem necessariamente descartar o pacote.

O mecanismo envolve:

- IP;
- TCP;
- remetente;
- receptor;
- roteadores intermediários.

De maneira simplificada:

```text
Sender
  |
  | IP
  v
Router
  |
  | marca ECN
  v
Receiver
  |
  | TCP ACK
  v
Sender
```

Assim, informações presentes no cabeçalho IP podem ser utilizadas em conjunto com o TCP para sinalizar congestionamento.

> **Referência:** Kurose & Ross, 8ª ed., Seção 3.7.2 e Seção 4.3.1.

---

### IP + TCP

Nas anotações aparece novamente a relação entre IP e TCP.

O IP fornece comunicação entre hosts:

$$
\boxed{
\text{host}
\longleftrightarrow
\text{host}
}
$$

O TCP utiliza o serviço do IP para oferecer comunicação confiável entre processos.

Uma representação simplificada é:

```text
Aplicação
   |
  TCP
   |
   IP
   |
Rede
```

**Campos que precisam ser verificados.**

A anotação destaca que alguns campos do cabeçalho precisam ser modificados ou verificados ao longo do caminho.

Um exemplo importante é o:

**TTL — Time To Live**

A cada roteador:

$$
TTL \leftarrow TTL-1.
$$

Como o TTL muda, o **header checksum do IPv4** precisa ser recalculado.

---

**MSS.** e tamanho do datagrama

Nas anotações aparece:

> MSS em geral é próximo de 1500 bytes.

Aqui é importante fazer uma distinção.

**MTU.**

Um valor comum de **MTU Ethernet** é:

$$
1500\text{ bytes}.
$$

**MSS.**

O **MSS — Maximum Segment Size** é o tamanho máximo da parte de dados de um segmento TCP.

Em uma Ethernet com MTU de 1500 bytes e cabeçalhos IPv4/TCP sem opções:

$$
MSS
=
1500-20-20
=
1460\text{ bytes}.
$$

Portanto:

$$
\boxed{
MTU\approx1500\text{ bytes}
}
$$

e, tipicamente:

$$
\boxed{
MSS\approx1460\text{ bytes}
}
$$

> **Correção:** a anotação manuscrita associa 1500 bytes diretamente ao MSS. O valor de 1500 bytes corresponde mais naturalmente à MTU Ethernet; o MSS TCP típico nesse caso é 1460 bytes.

---

### Fragmentação

Nas anotações:

> em geral, não é fragmentado.

A fragmentação ocorre quando um datagrama é maior que a MTU do enlace pelo qual precisa passar.

No IPv4 existem campos associados à fragmentação:

- Identification;
- Flags;
- Fragment Offset.

No destino, os fragmentos são reunidos novamente.

**IPv6.**

Nas anotações aparece:

> IPv6 removeu o suporte à fragmentação.

A formulação mais precisa é:

$$
\boxed{
\text{roteadores IPv6 não realizam fragmentação}
}
$$

No IPv6, se um pacote for grande demais para o próximo enlace, o roteador o descarta e envia uma mensagem ICMPv6 **Packet Too Big**.

A fragmentação, quando necessária, deve ser tratada pelos sistemas finais.

> **Referência:** Kurose & Ross, 8ª ed., Seção 4.3.4.

---

### Header Checksum

O IPv4 possui um **header checksum**.

Sua função é detectar erros no cabeçalho IP.

O checksum é calculado usando aritmética de complemento de 1.

De maneira conceitual:

$$
\boxed{
\text{Header Checksum}
\Rightarrow
\text{detecção de erros no cabeçalho IPv4}
}
$$

Como o TTL é alterado em cada roteador, o checksum precisa ser recalculado.

**IPv6.**

No IPv6, o header checksum foi removido.

Isso reduz o trabalho realizado pelos roteadores intermediários.

> **Referência:** Kurose & Ross, 8ª ed., Seções 4.3.1 e 4.3.4.

---

### Campo Protocol

O campo **Protocol** do IPv4 indica qual protocolo da camada superior deve receber o conteúdo do datagrama quando ele chega ao destino.

Exemplos:

- TCP:

$$
6
$$

- UDP:

$$
17
$$

Assim:

$$
\boxed{
\text{Protocol}
\Rightarrow
\text{demultiplexação IP para o protocolo superior}
}
$$

---

### Options

O IPv4 permite um campo de **Options**.

Esse campo torna o cabeçalho variável e pode exigir processamento adicional pelos roteadores.

Nas anotações aparece a ideia de que campos opcionais:

- tornam o processamento mais complexo;
- podem aumentar o tempo necessário em cada roteador.

Por esse motivo, o cabeçalho básico do IPv6 foi simplificado.

---

## Endereçamento IPv4

### Interfaces possuem endereços IP

Uma ideia importante é:

> um endereço IP é tecnicamente associado a uma **interface**, e não simplesmente ao dispositivo inteiro.

Um host normalmente possui uma interface de rede principal.

Um roteador possui várias interfaces e, consequentemente, pode possuir vários endereços IP.

Assim:

```text
Roteador

Interface 1 -> IP 1
Interface 2 -> IP 2
Interface 3 -> IP 3
```

---

### Sub-rede

Uma pergunta anotada foi:

> **O que é uma sub-rede?**

De forma prática, podemos pensar em uma sub-rede como um conjunto de interfaces que podem alcançar umas às outras sem atravessar um roteador intermediário.

Essas interfaces compartilham um mesmo prefixo de rede.

Assim:

$$
\boxed{
\text{sub-rede}
=
\text{grupo de interfaces com prefixo comum}
}
$$

---

### Endereçamento por classes

Nas anotações aparecem as antigas classes:

- Classe A;
- Classe B;
- Classe C.

Historicamente, os tamanhos básicos eram:

- Classe A:

$$
/8
$$

- Classe B:

$$
/16
$$

- Classe C:

$$
/24
$$

**Observação importante.**

Esse modelo é histórico.

Hoje o endereçamento utiliza **CIDR — Classless Inter-Domain Routing**, com prefixos de tamanho variável.

Por exemplo:

```text
192.168.1.0/24
10.10.0.0/16
172.20.64.0/20
```

> **Referência:** Kurose & Ross, 8ª ed., Seção 4.3.2.

---

### Hierarquia de endereçamento

As anotações destacam que os endereços precisam seguir uma estrutura hierárquica para permitir o funcionamento eficiente do roteamento.

Isso permite agregar vários endereços em um único prefixo.

Em vez de manter uma rota separada para cada host, um roteador pode manter:

```text
prefixo -> próximo salto
```

A agregação reduz o tamanho das tabelas de roteamento/forwarding.

---

## Perguntas anotadas para revisão

Nas anotações aparecem perguntas como:

### Q1 — Qual é o header IP?

Revisar os campos do cabeçalho IPv4:

- Version;
- Header Length;
- Type of Service;
- Datagram Length;
- Identifier;
- Flags;
- Fragment Offset;
- TTL;
- Protocol;
- Header Checksum;
- Source IP;
- Destination IP;
- Options.

### Q2 — O que é uma sub-rede?

Um conjunto de interfaces que compartilham um prefixo e podem se comunicar sem atravessar um roteador intermediário.

### Q3 — Como obter um endereço IP?

Uma das principais formas é por meio do:

**DHCP — Dynamic Host Configuration Protocol**.

---

## DHCP

O DHCP permite que um host obtenha automaticamente parâmetros de configuração da rede.

Entre eles:

- endereço IP;
- máscara/prefixo da rede;
- gateway padrão;
- servidor DNS;
- tempo de concessão (*lease*).

---

#### DHCP utiliza UDP

A pergunta anotada em aula foi:

> Qual protocolo é usado pelo DHCP?

O DHCP utiliza:

$$
\boxed{
UDP
}
$$

Tradicionalmente:

- servidor DHCP: porta UDP 67;
- cliente DHCP: porta UDP 68.

---

### Por que o DHCP precisa de broadcast?

Quando um host entra na rede pela primeira vez:

- ainda não possui endereço IP configurado;
- pode não saber o endereço do servidor DHCP.

Assim, o cliente inicialmente usa broadcast.

Por exemplo:

```text
Source IP:      0.0.0.0
Destination IP: 255.255.255.255
```

**Sequência DHCP.**

A sequência clássica pode ser lembrada como:

```text
DHCPDISCOVER
     ↓
DHCPOFFER
     ↓
DHCPREQUEST
     ↓
DHCPACK
```

ou:

$$
\boxed{
DORA
=
Discover
\rightarrow
Offer
\rightarrow
Request
\rightarrow
ACK
}
$$

> **Complemento:** no exemplo didático do Kurose, as mensagens iniciais são mostradas usando broadcast. Em implementações reais, o comportamento exato pode depender da etapa e da configuração.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.3.2, Figuras 4.23 e 4.24.

---

**Correção conceitual.** — camada do DHCP

Na anotação manuscrita aparece uma ideia semelhante a:

> DHCP é ao mesmo tempo um protocolo da camada de aplicação e da camada de rede.

A formulação mais precisa é:

$$
\boxed{
DHCP
\text{ é um protocolo da camada de aplicação}
}
$$

Ele utiliza UDP e serve para **configurar parâmetros relacionados à camada de rede**, como o endereço IP.

Portanto:

- protocolo: camada de aplicação;
- função: configuração da rede/IP.

---

### Conflito de endereços e negação de serviço

A anotação cita a possibilidade de causar problemas usando um endereço IP que já tenha sido atribuído a outro dispositivo.

Isso pode gerar:

- conflito de IP;
- interrupção da comunicação;
- indisponibilidade para um dos hosts.

Essa situação pode ser explorada maliciosamente como forma de causar negação de serviço.

---

## Escassez de endereços IPv4

As anotações destacam duas soluções importantes relacionadas à escassez de endereços IPv4:

1. **NAT — Network Address Translation**;
2. **IPv6**.

Também é citado o uso de:

**Carrier-Grade NAT — CGNAT**

por provedores.

---

## NAT — Network Address Translation

O NAT permite que vários dispositivos com endereços IP privados compartilhem um endereço IPv4 público.

Exemplo de rede interna:

```text
10.0.0.1
10.0.0.2
10.0.0.3
      \
       \
      NAT Router
          |
      Internet
```

Os endereços privados não precisam ser globalmente únicos.

---

### Mapeamento por portas

Um NAT utiliza uma tabela para relacionar:

```text
endereço/porta internos
        ↕
endereço/porta externos
```

Exemplo conceitual:

| Lado interno | Lado externo |
|---|---|
| `10.0.0.1:5001` | `200.1.1.5:40001` |
| `10.0.0.2:5001` | `200.1.1.5:40002` |
| `10.0.0.3:6000` | `200.1.1.5:40003` |

Assim, um único IP público pode representar várias conexões internas.

**Correção conceitual.**

A anotação diz, de forma resumida, que:

> “um IP global cria múltiplos IPs locais”.

Mais precisamente:

$$
\boxed{
\text{o NAT não cria os IPs privados}
}
$$

Ele **mapeia** os pares de endereço/porta privados para endereço/porta do lado público.

---

### Por que portas são necessárias?

As portas permitem distinguir diferentes processos e conexões.

No contexto do NAT, elas também ajudam a distinguir os diferentes fluxos que compartilham o mesmo endereço público.

Assim, para uma resposta que retorna da Internet, o NAT consulta sua tabela para descobrir:

> para qual host interno esse pacote deve ser encaminhado?

---

## Problema de servidores atrás de NAT

A aula discute um problema importante:

> Como um host externo inicia uma conexão com um servidor que está atrás de NAT?

Considere:

```text
Internet
   |
NAT Router
   |
   +-- 10.0.0.1
   +-- 10.0.0.2  <- servidor HTTP
   +-- 10.0.0.3
```

Um cliente externo conhece o endereço público do NAT, mas normalmente não consegue escolher diretamente:

```text
10.0.0.2
```

porque esse é um endereço privado.

---

### Solução 1 — servidor no próprio roteador/NAT

Uma possibilidade conceitual é executar o serviço diretamente no equipamento que possui o endereço público.

Isso evita o problema de descobrir qual host privado deve receber a conexão.

Entretanto, não é uma solução geral para todos os dispositivos internos.

---

### Solução 2 — configurar a tabela do NAT

Podemos configurar explicitamente um encaminhamento.

Por exemplo:

```text
IP público:80
        ↓
10.0.0.2:80
```

Esse mecanismo é conhecido como:

**port forwarding**

ou encaminhamento de portas.

Assim, conexões que chegam a uma determinada porta pública são encaminhadas ao servidor interno correspondente.

---

### Solução 3 — NAT traversal / hole punching

Outra abordagem citada é:

**NAT Hole Punching**

A ideia geral é permitir que hosts atrás de NAT criem previamente estados/mapeamentos no NAT e utilizem esses estados para permitir comunicação com hosts externos.

Nas anotações aparece essa ideia como uma técnica de **travessia do NAT**.

> **Referência:** Kurose & Ross, 8ª ed., Seção 4.3.3. O livro também menciona ferramentas específicas de NAT traversal para permitir comunicação com hosts localizados atrás de NAT.

---

## Próximo tópico — IPv6

A última anotação da aula indica:

> **Próxima aula: IPv6**

O IPv6 é uma solução estrutural para a limitação do espaço de endereços IPv4.

Enquanto IPv4 utiliza:

$$
32\text{ bits}
$$

IPv6 utiliza:

$$
128\text{ bits}.
$$

Esse tema fica para a sequência da disciplina.

---

## Resumo

Os principais tópicos desta aula foram:

- formato do datagrama IPv4;
- ECN;
- relação IP + TCP;
- TTL;
- header checksum;
- campo Protocol;
- Options;
- MTU e MSS;
- fragmentação IPv4;
- ausência de fragmentação em roteadores IPv6;
- endereçamento IPv4;
- interfaces e endereços IP;
- sub-redes;
- endereçamento histórico por classes:
  - `/8`;
  - `/16`;
  - `/24`;
- hierarquia e agregação;
- DHCP;
- DHCP sobre UDP;
- broadcast no DHCP;
- sequência DORA;
- conflito de endereços;
- escassez de IPv4;
- NAT;
- CGNAT;
- mapeamento endereço/porta;
- port forwarding;
- NAT traversal;
- NAT hole punching;
- introdução ao IPv6.
