# Aula 10 — 11/09/2026

# Camada de Aplicação — Continuação

Nesta aula foram concluídos e iniciados os seguintes tópicos da camada de aplicação:

- HTTP:
  - cookies e privacidade;
  - Web caching;
- e-mail;
- DNS:
  - resolução iterativa;
  - resolução recursiva;
- CDN, apenas como tópico indicado para a sequência.

---

# HTTP — Cookies, estado e privacidade

## HTTP continua stateless

Uma característica importante do HTTP é que o protocolo é **stateless**.

Isso significa que, por padrão, cada requisição HTTP é tratada de forma independente das anteriores.

Por exemplo:

```text
GET /pagina1
GET /pagina2
GET /imagem.png
```

O HTTP, por si só, não exige que o servidor associe automaticamente essas requisições a um mesmo histórico de interação.

Essa propriedade independe de a conexão HTTP ser:

- persistente;
- não persistente.

Mesmo quando uma conexão TCP é reutilizada no HTTP persistente, o HTTP continua sendo stateless.

---

## HTTP stateless × TCP stateful

É importante separar o estado mantido em diferentes camadas da pilha.

O **TCP é stateful**, pois mantém informações durante uma conexão, como:

- números de sequência;
- acknowledgments;
- buffers;
- temporizadores;
- estado da conexão.

Já o **HTTP é stateless**.

Assim:

\[
\boxed{
\text{TCP é stateful}
}
\]

enquanto:

\[
\boxed{
\text{HTTP é stateless}.
}
\]

Isso mostra que a propriedade de ser stateful ou stateless depende da camada e do protocolo analisado.

Uma visão simplificada é:

| Camada | Exemplo | Estado |
|---|---|---|
| Aplicação | HTTP | Stateless |
| Transporte | TCP | Stateful |
| Rede | IP | Stateless |

> **Observação:** mecanismos adicionais da aplicação, como cookies e sessões, podem manter estado sobre HTTP sem alterar o fato de o protocolo HTTP ser stateless.

---

# Cookies

Os **cookies** permitem que aplicações Web mantenham informações associadas a um usuário ou navegador entre diferentes requisições HTTP.

Eles são utilizados, por exemplo, para:

- autenticação e sessões;
- carrinhos de compras;
- preferências;
- personalização;
- rastreamento.

---

## Componentes do mecanismo de cookies

O mecanismo de cookies pode ser entendido a partir de quatro componentes principais:

1. um cabeçalho de cookie na resposta HTTP do servidor;
2. um cabeçalho de cookie em requisições HTTP posteriores;
3. armazenamento do cookie pelo navegador;
4. uma base de dados ou estado mantido pelo servidor associado ao identificador do cookie.

Uma interação simplificada é:

```text
Cliente                    Servidor
   |                           |
   | ------- requisição -----> |
   |                           |
   | <--- Set-Cookie: id=... --|
   |                           |
   | armazena cookie           |
   |                           |
   | ---- Cookie: id=... ----> |
   |                           |
```

Dessa forma, embora o HTTP continue stateless, a aplicação consegue relacionar requisições diferentes.

---

## Cookies e persistência HTTP

Cookies e conexões persistentes são conceitos diferentes.

### HTTP persistente

A mesma conexão TCP pode ser reutilizada:

```text
TCP
 |
 |-- GET HTML
 |-- GET img1
 |-- GET img2
```

### HTTP não persistente

Conexões TCP diferentes podem ser utilizadas:

```text
TCP 1 -> GET HTML
TCP 2 -> GET img1
TCP 3 -> GET img2
```

O cookie pode ser enviado em ambos os casos.

Portanto:

\[
\boxed{
\text{cookie não depende de a conexão HTTP ser persistente}.
}
\]

---

## Cookies e privacidade

Cookies também podem ser utilizados para acompanhar o comportamento do usuário.

Um caso relevante são os **third-party cookies**.

Eles podem permitir que uma terceira entidade, como um provedor de anúncios, observe interações realizadas pelo usuário em diferentes páginas ou sites que utilizam conteúdo dessa entidade.

Isso gera questões de privacidade, pois informações sobre navegação e comportamento podem ser correlacionadas.

---

# AJAX

Foi citado em aula o uso de **AJAX** em páginas Web.

AJAX permite que uma página faça requisições ao servidor sem precisar recarregar a página inteira.

Isso possibilita páginas mais dinâmicas, nas quais partes do conteúdo são atualizadas separadamente.

Essas requisições também podem ser utilizadas para transmitir ao servidor informações sobre ações realizadas pelo usuário na página.

> **Observação:** AJAX apareceu relacionado à discussão sobre conteúdo dinâmico, anúncios e privacidade, sem um aprofundamento de sua implementação nesta aula.

---

# Web Caching

Uma **Web cache** armazena cópias de objetos Web solicitados anteriormente.

Podemos representar:

\[
\text{Cliente}
\longleftrightarrow
\text{Cache}
\longleftrightarrow
\text{Servidor de origem}.
\]

A cache atua:

- como **servidor** para o cliente;
- como **cliente** para o servidor de origem.

---

## Benefícios da cache

A cache pode beneficiar diferentes partes da rede.

### Para o cliente

Reduz o tempo de resposta:

\[
\boxed{
\text{menor response time}
}
\]

### Para o servidor

Reduz a quantidade de requisições que precisam chegar ao servidor de origem:

\[
\boxed{
\text{menor carga no servidor}
}
\]

### Para a rede

Reduz o tráfego em enlaces compartilhados e gargalos:

\[
\boxed{
\text{menor utilização dos recursos da rede}
}
\]

---

# Exemplo de Web Caching

Considere o exemplo discutido em sala:

- taxa média de requisições:

\[
a=15\text{ requisições/s};
\]

- tamanho médio de cada objeto:

\[
L=1\text{ Mbit};
\]

- LAN interna:

\[
R_{\text{LAN}}=100\text{ Mbps};
\]

- enlace de acesso à Internet:

\[
R_{\text{acesso}}=15\text{ Mbps};
\]

- atraso médio na Internet:

\[
d_{\text{Internet}}\approx2\text{ s}.
\]

---

## Intensidade de tráfego na LAN

A intensidade de tráfego é:

\[
I=\frac{La}{R}.
\]

Para a LAN:

\[
I_{\text{LAN}}
=
\frac{
(1\text{ Mbit})(15\text{ req/s})
}{
100\text{ Mbps}
}.
\]

Logo:

\[
\boxed{
I_{\text{LAN}}=0{,}15.
}
\]

A LAN está, portanto, longe da saturação.

---

## Intensidade de tráfego no enlace de acesso

Para o enlace de acesso:

\[
I_{\text{acesso}}
=
\frac{
(1\text{ Mbit})(15\text{ req/s})
}{
15\text{ Mbps}
}.
\]

Portanto:

\[
\boxed{
I_{\text{acesso}}=1.
}
\]

Esse enlace é o **gargalo**.

Quando:

\[
I\rightarrow1,
\]

o atraso de fila cresce rapidamente.

Assim, mesmo que a LAN tenha grande capacidade, o enlace de acesso pode dominar o tempo de resposta.

---

## Tempo total de resposta

O tempo total percebido pelo cliente pode ser pensado aproximadamente como:

\[
\boxed{
d_{\text{total}}
=
d_{\text{LAN}}
+
d_{\text{acesso}}
+
d_{\text{Internet}}.
}
\]

No exemplo:

\[
d_{\text{Internet}}\approx2\text{ s}.
\]

Se o enlace de acesso opera próximo da saturação, o atraso nesse enlace também pode se tornar muito grande.

---

# Alternativas para reduzir o gargalo

## Aumentar a capacidade do enlace

Uma possibilidade é aumentar:

\[
R_{\text{acesso}}.
\]

Isso diminui a intensidade de tráfego:

\[
I=\frac{La}{R}.
\]

Entretanto, aumentar a capacidade do enlace pode ter custo elevado.

Além disso, mesmo aumentando a capacidade local, o atraso associado ao restante da Internet continua existindo.

---

## Utilizar cache

Outra solução é diminuir a quantidade de requisições que precisam atravessar o enlace de acesso.

Se parte das requisições for atendida localmente pela cache, a taxa efetiva de tráfego no enlace diminui.

Assim:

\[
a_{\text{Internet}}<a.
\]

Consequentemente:

\[
I_{\text{acesso}}
=
\frac{La_{\text{Internet}}}{R}
\]

também diminui.

Isso reduz:

- o atraso de fila no gargalo;
- o tráfego no enlace de acesso;
- a quantidade de requisições que precisam atravessar a Internet.

Além disso, em um **cache hit**, o objeto pode ser obtido localmente, evitando também o atraso associado ao caminho até o servidor de origem.

---

## Relação com o Capítulo 1

A discussão de cache retoma a análise de filas feita anteriormente.

A relação

\[
I=\frac{La}{R}
\]

mostra que existem duas formas principais de reduzir a intensidade de tráfego:

1. aumentar a capacidade:

\[
R\uparrow;
\]

2. diminuir a carga:

\[
a\downarrow.
\]

A cache atua principalmente na segunda alternativa.

---

# E-mail

O sistema de e-mail na Internet envolve diferentes componentes.

Entre eles:

- **user agents**;
- **mail servers**;
- protocolos de transferência e acesso a mensagens.

Uma representação simplificada é:

```text
Usuário A
   |
   v
Mail Server A
   |
   | SMTP
   v
Mail Server B
   |
   v
Usuário B
```

---

# SMTP

O **SMTP (Simple Mail Transfer Protocol)** é utilizado principalmente para transferir mensagens de e-mail entre servidores de e-mail.

De maneira simplificada:

\[
\boxed{
\text{Mail Server A}
\xrightarrow{\text{SMTP}}
\text{Mail Server B}.
}
\]

O SMTP utiliza TCP para obter transferência confiável dos dados.

---

## SMTP como protocolo de push

O SMTP é essencialmente um protocolo de **push**.

Isso significa que o lado emissor inicia a transferência e envia a mensagem ao destino.

Assim:

\[
\boxed{
\text{SMTP} \rightarrow \text{push}
}
\]

---

## SMTP e segurança

O SMTP original não foi projetado com mecanismos modernos de segurança integrados.

Mecanismos adicionais podem ser utilizados atualmente para proteger a comunicação e autenticar participantes.

> **Observação:** em aula foi comentada a existência de vulnerabilidades históricas associadas a servidores de e-mail e ao processamento inadequado de conteúdo recebido. O exemplo específico nas anotações não está legível o suficiente para ser reproduzido com segurança.

---

## SMTP e texto

Historicamente, o SMTP foi projetado em torno de mensagens de texto ASCII.

Isso gerou a necessidade de mecanismos adicionais para transportar conteúdos que não são naturalmente texto simples, como:

- imagens;
- áudio;
- vídeos;
- outros arquivos binários.

---

## Comunicação direta com SMTP

Como SMTP é um protocolo textual, é possível observar seus comandos diretamente através de uma conexão com um servidor SMTP.

Foi mencionado em aula o uso de:

```bash
telnet servidor 25
```

para estabelecer uma conexão TCP com a porta tradicional do SMTP e interagir manualmente com o servidor.

> **Observação:** essa prática é útil para fins didáticos em ambientes apropriados. Muitos servidores modernos restringem esse tipo de acesso ou utilizam mecanismos adicionais de segurança.

---

# SMTP × IMAP

SMTP e IMAP possuem funções diferentes.

## SMTP

É usado principalmente para:

\[
\boxed{
\text{enviar/transferir mensagens}.
}
\]

## IMAP

O **IMAP (Internet Message Access Protocol)** é utilizado para acessar e gerenciar mensagens armazenadas em um servidor de e-mail.

Assim:

\[
\boxed{
\text{SMTP} \rightarrow \text{envio}
}
\]

\[
\boxed{
\text{IMAP} \rightarrow \text{acesso e gerenciamento}
}
\]

Uma arquitetura simplificada é:

```text
Usuário A
   |
   | SMTP/HTTP
   v
Servidor de A
   |
   | SMTP
   v
Servidor de B
   |
   | IMAP/HTTP
   v
Usuário B
```

---

# DNS — Domain Name System

O **DNS (Domain Name System)** fornece um mecanismo para relacionar nomes utilizados por pessoas e aplicações com endereços IP.

Por exemplo:

\[
\boxed{
\text{www.exemplo.com}
\longrightarrow
\text{endereço IP}.
}
\]

Uma das principais funções do DNS é, portanto:

\[
\boxed{
\text{hostname}
\longleftrightarrow
\text{endereço IP}.
}
\]

---

## DNS é um protocolo da camada de aplicação

Embora sua função seja essencial para praticamente toda a Internet, o DNS é implementado como um protocolo da **camada de aplicação**.

Ele utiliza a infraestrutura de transporte e rede para trocar suas mensagens.

---

# Por que o DNS não é centralizado?

Uma possível arquitetura seria manter todas as associações entre nomes e endereços IP em um único servidor.

Isso seria problemático devido a fatores como:

- ponto único de falha;
- grande volume de consultas;
- distância entre usuários e servidor;
- manutenção de uma base de dados gigantesca;
- baixa escalabilidade.

Por isso, o DNS utiliza uma base de dados:

\[
\boxed{
\text{distribuída e hierárquica}.
}
\]

---

# Hierarquia DNS

A hierarquia envolve diferentes tipos de servidores.

Entre eles:

1. **Root DNS Servers**;
2. **TLD DNS Servers**;
3. **Authoritative DNS Servers**;
4. **Local DNS Server**, utilizado pelo cliente para realizar consultas.

Uma representação simplificada é:

```text
                   Root
                    |
            -----------------
            |       |       |
          .com     .org    .br
            |
           TLD
            |
      Authoritative
            |
         amazon.com
```

---

## Root DNS Server

Os servidores raiz ficam no topo da hierarquia.

Eles não precisam conhecer diretamente o endereço IP de todos os hosts.

Em vez disso, podem indicar servidores responsáveis pelos domínios de nível superior.

---

## TLD DNS Server

TLD significa:

**Top-Level Domain**.

Exemplos:

- `.com`;
- `.org`;
- `.edu`;
- `.br`.

Os servidores TLD conhecem informações que permitem chegar aos servidores autoritativos dos domínios correspondentes.

---

## Authoritative DNS Server

O servidor DNS autoritativo possui informações sobre determinado domínio.

Por exemplo, um servidor autoritativo de:

```text
amazon.com
```

pode fornecer informações necessárias para resolver nomes pertencentes a esse domínio.

---

## Local DNS Server

O cliente normalmente envia inicialmente sua consulta a um **servidor DNS local**.

Esse servidor pode:

- responder utilizando informações presentes em cache;
- realizar consultas aos demais servidores DNS para descobrir a resposta.

---

# Resolução DNS

Existem duas formas principais de organizar as consultas DNS:

- **iterativa**;
- **recursiva**.

---

# Resolução Iterativa

Na resolução iterativa, o servidor consultado não precisa obter sozinho a resposta final.

Ele pode indicar qual servidor deve ser consultado em seguida.

Por exemplo:

```text
Cliente
   |
   v
DNS Local
   |
   | 1. consulta
   v
Root
   |
   | 2. referência para TLD
   v
DNS Local
   |
   | 3. consulta
   v
TLD
   |
   | 4. referência para autoritativo
   v
DNS Local
   |
   | 5. consulta
   v
Authoritative
   |
   | 6. resposta final
   v
DNS Local
   |
   v
Cliente
```

Nesse caso, o DNS local conduz a busca passo a passo.

---

# Resolução Recursiva

Na resolução recursiva, o servidor que recebe a consulta assume a responsabilidade de buscar a resposta junto aos demais servidores.

De maneira conceitual:

```text
Cliente
   |
   | consulta
   v
DNS Local
   |
   | consulta
   v
Root
   |
   | consulta
   v
TLD
   |
   | consulta
   v
Authoritative
```

As respostas então retornam pelo caminho:

```text
Authoritative
   |
   v
TLD
   |
   v
Root
   |
   v
DNS Local
   |
   v
Cliente
```

Assim, a responsabilidade por continuar a consulta é repassada de servidor para servidor.

---

# Comparação entre resolução iterativa e recursiva

## Iterativa

O servidor consultado pode responder:

> "Eu não possuo a resposta final, mas consulte este outro servidor."

O solicitante continua a busca.

## Recursiva

O servidor consultado recebe a responsabilidade de buscar a resposta final e devolvê-la ao solicitante.

---

# Cache DNS

O uso de cache é muito importante no DNS.

Quando um servidor DNS obtém uma associação entre nome e endereço, ele pode armazená-la temporariamente.

Consultas futuras podem então ser respondidas diretamente:

\[
\boxed{
\text{DNS Cache Hit}
\Rightarrow
\text{menos consultas pela hierarquia}.
}
\]

Entre os benefícios estão:

- menor atraso;
- redução do número de mensagens DNS;
- redução da carga sobre servidores raiz, TLD e autoritativos.

As entradas normalmente permanecem na cache durante um período definido por um **TTL (Time To Live)**.

---

# CDN — Content Distribution Network

O tópico **CDN (Content Distribution Network)** foi indicado ao final da aula para a sequência do conteúdo.

A ideia geral de uma CDN é distribuir cópias de conteúdos em diferentes servidores geograficamente distribuídos, aproximando os dados dos usuários.

Isso pode:

- diminuir o atraso;
- reduzir tráfego em enlaces distantes;
- reduzir carga sobre o servidor de origem.

> **Observação:** CDN foi apenas indicada nesta aula e não foi desenvolvida em detalhes nas anotações.

---

# Resumo

Os principais tópicos desta aula foram:

- HTTP continua stateless mesmo quando usa TCP persistente;
- TCP é stateful;
- cookies permitem que aplicações mantenham estado sobre HTTP;
- cookies também possuem implicações de privacidade;
- Web caching reduz atraso, carga do servidor e tráfego da rede;
- a cache pode reduzir a intensidade de tráfego de um enlace gargalo;
- SMTP é utilizado para transferência de e-mails;
- SMTP utiliza TCP e opera principalmente como protocolo de push;
- IMAP é utilizado para acesso e gerenciamento de mensagens;
- DNS mapeia nomes para endereços IP;
- DNS é distribuído e hierárquico;
- a hierarquia inclui servidores root, TLD e autoritativos;
- consultas DNS podem ser iterativas ou recursivas;
- cache DNS reduz atraso e quantidade de consultas.

