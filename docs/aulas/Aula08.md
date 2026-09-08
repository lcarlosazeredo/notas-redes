# Aula 08 — 04/09/2026

# Teoria de Filas — Continuação

## Um sistema pode ser estável com $I=1$?

Pergunta levantada em aula:

> É possível existir um sistema estável mesmo com $I=1$?

Sim, em situações especiais.

Um exemplo é uma fila:

\[
D/D/1,
\]

na qual:

- as chegadas são determinísticas;
- os tempos de serviço são determinísticos;
- existe um único servidor.

Se as chegadas e os serviços ocorrerem de forma perfeitamente regular e sincronizada, é possível ter:

\[
\lambda=\mu
\]

e, portanto,

\[
I=\frac{\lambda}{\mu}=1,
\]

sem que a fila cresça indefinidamente.

> **Observação:** esse é um caso limite e altamente regular. Para o modelo
> $M/M/1$, a condição usual de estabilidade é estritamente $I<1$.

---

# M/M/1 e M/D/1

## Fila M/M/1

No modelo $M/M/1$:

- as chegadas são Poisson;
- os tempos entre chegadas são exponenciais;
- os tempos de serviço são exponenciais;
- existe um único servidor.

A condição de estabilidade é:

\[
\boxed{I<1}.
\]

Como o tempo de serviço é exponencial, ele possui a propriedade de **falta de memória**.

Isso terá uma consequência importante para o tempo residual de serviço.

---

## Fila M/D/1

No modelo $M/D/1$:

- as chegadas são Poisson;
- o tempo de serviço é determinístico;
- existe um único servidor.

A diferença fundamental em relação ao $M/M/1$ é que o tempo de serviço não é aleatório.

Essa diferença altera o atraso médio de fila.

---

# Vida residual de serviço

Quando um pacote chega e encontra o servidor ocupado, ele não necessariamente precisa esperar um tempo de serviço completo.

Ele precisa esperar apenas o **tempo restante** do serviço que já estava em andamento.

Defina:

\[
S_R=\text{vida residual do serviço}.
\]

Para um tempo de serviço geral $S$, a vida residual média é:

\[
\boxed{
\bar S_R
=
\frac{E[S^2]}{2E[S]}.
}
\]

---

## Caso exponencial — M/M/1

A distribuição exponencial possui a propriedade de falta de memória.

Logo, ao observar um serviço exponencial que já está em andamento, o tempo médio restante é igual ao tempo médio de serviço original:

\[
\boxed{
\bar S_R=\bar S.
}
\]

---

## Caso determinístico — M/D/1

Se todos os serviços possuem exatamente duração $S$, uma chegada que encontra o servidor ocupado pode encontrá-lo em qualquer ponto do intervalo de serviço.

Em média, resta metade do serviço:

\[
\boxed{
\bar S_R=\frac{S}{2}.
}
\]

Essa diferença é uma das razões pelas quais uma fila com serviços determinísticos possui menor atraso médio que uma fila com serviços exponenciais de mesma média.

---

# Atraso médio de fila

Defina:

- $\bar W$: atraso médio de fila;
- $\bar N_q$: número médio de pacotes esperando na fila;
- $\bar N_s$: número médio de pacotes no servidor;
- $\bar S$: tempo médio de serviço;
- $\bar S_R$: tempo residual médio do serviço.

Um pacote que chega precisa esperar:

1. os pacotes que já estão na fila;
2. o tempo restante do eventual pacote que está sendo atendido.

Assim:

\[
\boxed{
\bar W
=
\bar N_q\bar S
+
\bar N_s\bar S_R.
}
\]

Como existe no máximo um pacote no servidor,

\[
\bar N_s=P(\text{ocupado}).
\]

Além disso,

\[
P(\text{ocupado})=I.
\]

Portanto:

\[
\boxed{
\bar N_s=I.
}
\]

---

## Atraso no M/M/1

No $M/M/1$:

\[
\bar S_R=\bar S.
\]

Logo:

\[
\bar W
=
\bar N_q\bar S
+
I\bar S.
\]

Pela Lei de Little aplicada à fila:

\[
\bar N_q=\lambda\bar W.
\]

Então:

\[
\bar W
=
\lambda\bar W\bar S+I\bar S.
\]

Como

\[
\lambda\bar S=I,
\]

temos:

\[
\bar W
=
I\bar W+I\bar S.
\]

Portanto:

\[
(1-I)\bar W=I\bar S,
\]

e:

\[
\boxed{
\bar W_{M/M/1}
=
\frac{I\bar S}{1-I}.
}
\]

---

## Atraso no M/D/1

No $M/D/1$:

\[
\bar S_R=\frac{\bar S}{2}.
\]

Assim:

\[
\bar W
=
\bar N_q\bar S
+
I\frac{\bar S}{2}.
\]

Novamente:

\[
\bar N_q=\lambda\bar W.
\]

Logo:

\[
\bar W
=
\lambda\bar W\bar S
+
I\frac{\bar S}{2}.
\]

Como:

\[
\lambda\bar S=I,
\]

segue que:

\[
\bar W
=
I\bar W
+
I\frac{\bar S}{2}.
\]

Portanto:

\[
(1-I)\bar W
=
I\frac{\bar S}{2}.
\]

Finalmente:

\[
\boxed{
\bar W_{M/D/1}
=
\frac{I\bar S}{2(1-I)}.
}
\]

Comparando os dois modelos com a mesma utilização e o mesmo tempo médio de serviço:

\[
\boxed{
\bar W_{M/D/1}
=
\frac{1}{2}\bar W_{M/M/1}.
}
\]

A menor variabilidade do serviço reduz o atraso de fila.

---

## Forma geral

Partindo de:

\[
\bar W
=
\bar N_q\bar S
+
I\bar S_R
\]

e usando:

\[
\bar N_q=\lambda\bar W,
\]

temos:

\[
\bar W
=
\lambda\bar W\bar S
+
I\bar S_R.
\]

Como:

\[
\lambda\bar S=I,
\]

segue que:

\[
\bar W(1-I)=I\bar S_R.
\]

Portanto:

\[
\boxed{
\bar W
=
\frac{I\bar S_R}{1-I}.
}
\]

Utilizando:

\[
\bar S_R
=
\frac{E[S^2]}{2E[S]},
\]

obtemos:

\[
\boxed{
\bar W
=
\frac{\lambda E[S^2]}
{2(1-I)}.
}
\]

> **Observação:** essa expressão deixa explícito que não apenas a média,
> mas também a variabilidade do tempo de serviço influencia o atraso.

---

# Mesma média, comportamentos diferentes

Dois sistemas podem possuir a mesma taxa média de chegadas ou a mesma taxa média de serviço e ainda assim apresentar desempenhos diferentes.

Considere dois padrões:

1. um padrão regular, com eventos mais igualmente espaçados;
2. um padrão mais concentrado, com períodos de maior agrupamento.

Mesmo que ambos possuam a mesma média, o primeiro tende a produzir filas menores.

Portanto:

\[
\boxed{
\text{média igual}
\not\Rightarrow
\text{mesmo atraso de fila}.
}
\]

A **variabilidade** dos processos também é importante.

> **[Inserir figura]** Comparação feita em sala entre dois padrões com a
> mesma média, sendo o padrão mais regular mais vantajoso.

---

# Throughput

O **throughput** representa a taxa efetiva com que dados são entregues.

Podemos calculá-lo condicionando no estado do servidor.

Se o servidor está:

- ocupado, transmite à taxa $\mu$ pacotes/s;
- ocioso, transmite $0$ pacotes/s.

Assim:

\[
E[\text{throughput}]
=
E[\text{throughput}\mid\text{ocupado}]
P(\text{ocupado})
+
E[\text{throughput}\mid\text{ocioso}]
P(\text{ocioso}).
\]

Logo:

\[
E[\text{throughput}]
=
\mu I+0(1-I).
\]

Como:

\[
I=\frac{\lambda}{\mu},
\]

temos:

\[
\boxed{
E[\text{throughput}]
=
\lambda
}
\]

em pacotes/s, para um sistema estável em equilíbrio.

Se cada pacote possui $L$ bits, então em bits/s:

\[
\boxed{
E[\text{throughput}]
=
\lambda L
=
IR.
}
\]

---

# Probabilidade de o sistema estar vazio

No modelo $M/M/1$, denote por:

\[
\pi_0=P(N=0)
\]

a probabilidade de não haver nenhum pacote no sistema.

Como:

\[
P(\text{ocupado})=I,
\]

temos:

\[
P(\text{ocioso})=1-I.
\]

Portanto:

\[
\boxed{
\pi_0
=
1-I.
}
\]

Equivalentemente:

\[
\pi_0
=
1-\rho
=
1-U
=
1-P(\text{ocupado}).
\]

> **[Inserir figura]** Cadeia de estados $0,1,2,\ldots$ com taxas de
> chegada $\lambda$ e serviço $\mu$.

---

# Traceroute

O **traceroute** é uma ferramenta utilizada para observar o caminho percorrido pelos pacotes entre uma origem e um destino.

Além de identificar roteadores intermediários, ele permite obter medidas de atraso até diferentes pontos do caminho.

A ideia utiliza o campo **TTL — Time To Live** do pacote.

Variando o TTL, é possível fazer com que o pacote expire sucessivamente em diferentes roteadores do caminho e, assim, descobrir esses roteadores.

Por exemplo:

- TTL $=1$: alcança o primeiro roteador;
- TTL $=2$: alcança o segundo;
- TTL $=3$: alcança o terceiro;
- e assim por diante.

Normalmente são enviadas múltiplas sondagens (*probes*) para cada valor de TTL, permitindo observar os tempos medidos.

> **[Inserir figura]** Esquema feito em sala com três probes e TTL
> crescente para observar o atraso da origem ao destino.

---

# Gargalos e Cache

Foram discutidas formas de reduzir o impacto de um gargalo na rede.

## Upgrade da infraestrutura

Uma possibilidade é aumentar a capacidade do sistema, por exemplo aumentando a capacidade de determinado enlace.

Essa alternativa pode reduzir congestionamento e atraso, porém pode possuir custo elevado.

## Uso de cache

Outra estratégia é utilizar **cache** para responder parte das requisições mais próximo do usuário.

Nesse caso, uma requisição que encontra o conteúdo na cache não precisa atravessar todo o caminho até o servidor original.

Entre os possíveis benefícios estão:

- redução do atraso percebido pelo usuário;
- redução do tráfego atravessando o gargalo;
- redução da capacidade necessária em determinados enlaces.

---

# Camadas e Encapsulamento

## Comunicação entre hosts e entre vizinhos

A pilha de protocolos permite observar diferentes tipos de comunicação lógica.

Na **camada de rede**, consideramos a comunicação entre hosts:

\[
\text{host de origem}
\longleftrightarrow
\text{host de destino}.
\]

Na **camada de enlace**, a comunicação ocorre entre nós diretamente conectados:

\[
\text{nó}
\longleftrightarrow
\text{nó vizinho}.
\]

Assim:

- **Network layer**: comunicação host a host;
- **Link layer**: comunicação entre nós vizinhos.

---

## Encapsulamento

À medida que os dados descem pela pilha de protocolos, cada camada acrescenta suas próprias informações de controle.

De forma simplificada:

\[
\text{mensagem da aplicação}
\]

torna-se:

\[
\text{segmento da camada de transporte},
\]

que é encapsulado em:

\[
\text{datagrama da camada de rede},
\]

que, por sua vez, é encapsulado em:

\[
\text{quadro da camada de enlace}.
\]

Assim:

\[
\boxed{
\text{Mensagem}
\rightarrow
\text{Segmento}
\rightarrow
\text{Datagrama}
\rightarrow
\text{Frame}.
}
\]

No destino ocorre o processo inverso, com cada camada removendo e interpretando as informações correspondentes.

---

# Segurança em Redes

Foram destacados três objetivos clássicos de segurança:

\[
\boxed{
\text{Availability}
\qquad
\text{Integrity}
\qquad
\text{Confidentiality}
}
\]

ou:

- **Disponibilidade**;
- **Integridade**;
- **Confidencialidade**.

---

## Availability — Disponibilidade

A disponibilidade está relacionada à capacidade de manter o serviço acessível aos usuários legítimos.

Um exemplo de ataque associado é o:

**DoS — Denial of Service**.

Nesse tipo de ataque, busca-se impedir ou dificultar o acesso ao serviço.

Uma possível linha de defesa envolve o uso de mecanismos como:

- firewall;
- filtragem de tráfego.

---

## Integrity — Integridade

A integridade está relacionada a impedir alterações indevidas nas informações.

Um ataque pode tentar modificar, falsificar ou produzir informações que aparentem vir de outra origem.

Foi mencionado em aula o conceito de **spoofing**.

Mecanismos de autenticação e verificação de integridade podem ser utilizados como defesa.

---

## Confidentiality — Confidencialidade

A confidencialidade busca impedir que terceiros não autorizados tenham acesso ao conteúdo da comunicação.

Um exemplo é o **sniffing**, no qual um atacante observa o tráfego que passa pela rede.

Uma defesa importante é a utilização de:

\[
\boxed{\text{criptografia}}.
\]

---

## Caso citado

Foi citado em aula:

**Fancy Bear Goes Phishing**.

> **Observação:** o caso foi mencionado em conexão com segurança,
> sem desenvolvimento detalhado nas anotações.

---

# Camada de Aplicação

## Comunicação entre processos

Uma aplicação distribuída é formada por processos executando em sistemas finais diferentes.

Para que esses processos se comuniquem através da rede, é necessário algum mecanismo de **comunicação entre processos — IPC** (*Inter-Process Communication*).

Alguns mecanismos citados em aula foram:

- pipes;
- sinais;
- mensagens;
- memória compartilhada.

Quando a comunicação ocorre entre processos através da rede, os **sockets** são um mecanismo fundamental.

---

# Socket

Um **socket** é a interface através da qual um processo da camada de aplicação envia e recebe dados utilizando a camada de transporte.

Podemos visualizar:

\[
\boxed{
\text{Aplicação}
\longleftrightarrow
\text{Socket}
\longleftrightarrow
\text{Transporte}.
}
\]

Para enviar dados, a aplicação escreve no socket.

Para receber dados, a aplicação lê do socket.

Assim:

\[
\text{processo}
\rightarrow
\text{socket}
\rightarrow
\text{rede}
\]

e, no destino:

\[
\text{rede}
\rightarrow
\text{socket}
\rightarrow
\text{processo}.
\]

---

## IP e portas

Conhecer apenas o endereço IP de um host não é suficiente para identificar a aplicação com a qual queremos nos comunicar.

Em um mesmo host podem existir simultaneamente vários processos utilizando a rede.

Por isso, utilizamos **números de porta**.

De maneira simplificada:

\[
\boxed{
\text{IP}
\rightarrow
\text{identifica o host}
}
\]

e:

\[
\boxed{
\text{porta}
\rightarrow
\text{identifica o processo/serviço no host}.
}
\]

Um endpoint de comunicação pode então ser associado ao par:

\[
(\text{endereço IP},\text{porta}).
\]

No caso de uma conexão TCP, a conexão é distinguida pelas duas extremidades:

\[
(
IP_{\text{origem}},
porta_{\text{origem}},
IP_{\text{destino}},
porta_{\text{destino}}
).
\]

---

# Requisitos das Aplicações

Diferentes aplicações possuem diferentes necessidades em relação ao serviço oferecido pela camada de transporte.

Foram destacadas características como:

- **integridade dos dados**;
- **timing**;
- **throughput**.

Por exemplo, determinada aplicação pode exigir entrega confiável de todos os dados, enquanto outra pode priorizar baixa latência mesmo tolerando alguma perda.

A escolha do protocolo de transporte depende dessas necessidades.

---

# TCP e UDP para Aplicações

Os dois principais protocolos de transporte estudados são:

- TCP;
- UDP.

## UDP

O UDP é um protocolo relativamente **leve**.

Ele possui pouca sobrecarga e não estabelece uma conexão antes de transmitir os dados.

De forma simplificada:

\[
\boxed{
\text{UDP}
\rightarrow
\text{serviço mais simples}.
}
\]

---

## TCP

O TCP oferece mais mecanismos para a aplicação e, por isso, pode ser visto como um protocolo mais **pesado** que o UDP.

Ele estabelece uma conexão e oferece mecanismos de transferência confiável de dados.

De forma simplificada:

\[
\boxed{
\text{TCP}
\rightarrow
\text{mais funcionalidades e maior controle}.
}
\]

---

## A aplicação escolhe o transporte

Ao desenvolver uma aplicação de rede, é necessário escolher qual protocolo de transporte atende melhor às suas necessidades.

Portanto, para estudar uma aplicação de rede, também é importante entender o serviço de transporte utilizado por ela.

---

# HTTP e HTTPS

Historicamente, versões tradicionais do HTTP utilizam TCP como protocolo de transporte.

De maneira simplificada:

\[
\text{HTTP}
\rightarrow
\text{TCP}.
\]

Versões mais recentes também podem utilizar QUIC:

\[
\text{HTTP}
\rightarrow
\text{QUIC}
\rightarrow
\text{UDP}.
\]

O HTTP, sozinho, não fornece proteção criptográfica para a comunicação.

No HTTPS, mecanismos de segurança são adicionados à comunicação HTTP.

---

# Aplicações citadas

Entre as aplicações/protocolos da camada de aplicação mencionados em aula estão:

- HTTP;
- e-mail;
- DNS.

Essas aplicações utilizam sockets para acessar os serviços da camada de transporte.

> **Observação importante sobre DNS:** DNS não deve ser classificado
> simplesmente como um serviço TCP. Consultas DNS normalmente utilizam
> UDP, embora TCP também possa ser utilizado em situações específicas.

---

# Próximo tópico

A sequência da disciplina passa a estudar com mais detalhes a **camada de aplicação** e a construção de aplicações que se comunicam através de sockets.