# Validador de formulário

O exercício consiste em criar um validador de formulários em JavaScript. A ideia é criar uma biblioteca completamente modular, que pode validar o formulário baseado em validadores existes, além de validações personalizadas.

As validações mais comuns, que quase todo app precisa, são para:

* Validar se um campo foi preenchido.
* Validar um formato de um campo.
* Validar se um campo tem o mesmo valor de outro (confirmação).
* Validar a quantidade de caracteres de um campo.

Os requisitos são:

* Ao enviar o formulário, as validações devem ser executadas. Caso alguma validação falhe, adicione uma classe `with-error` no container `<p>`.
* As mensagens de erro devem ser exibidas antes dos campos, com uma mensagem como `Please double check your data before continuing`, com uma lista de todas as mensagens de erro.
* Ao dar foco em um campo cujo container possua a classe `with-error`, deve-se remover esta classe. A ideia é que a indicação visual só faz sentido quando não se está no campo.
* Campos inválidos devem com mais de uma mensagem de erro devem exibir apenas a primeira mensagem de modo `inline`.
* As mensagens de validação são configuráveis (você pode mudar a mensagem, idioma da mensagem, etc), mas devem ter uma mensagem padrão.

![Formulário](https://dl.dropboxusercontent.com/s/nom8gr6kez5ees1/2014-03-15%20at%2010.06.png)

A regras de validação são as seguintes:

* O campo `Your name` não pode ficar em branco.
* O campo `Your e-mail` deve ser validado com a seguinte expressão regular: `/^[a-z0-9]+([._][a-z0-9]+)*(+[a-z0-9_-]+)@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,4}?$/i`.
* O campo `Your password` deve ter conter pelo menos 8 caracteres.
* O campo `Confirm your password` deve ser igual ao campo `Your password`.

Para ver o formulário em ação, visite a URL <http://codepen.io/fnando/full/Khget>.

**Lembre-se!** Não modifique o HTML, nem o CSS. Apenas faça com que a validação funcione, adicionando os elementos necessários para que as mensagens de erro sejam exibidas.

O código que usa sua biblioteca de validação de formulários deve estar no arquivo `assets/script.js`. Já o código da biblioteca de validação deve estar no arquivo `form_validator.js`.

O HTML possui algumas coisas que você terá que remover antes de começar:

* Remova a classe `with-error` do container do campo de nome.
* Remova a mensagem de erro inline do campo de nome.
* Remova as mensagens de erro adicionas no container `.error-messages`.

Elas estão presentes apenas para guiar a sua implementação.

## Testes

O projeto já está preparado com [Jasmine](http://jasmine.github.io), mas você pode usar qualquer framework de testes. Você precisará adicionar os arquivos de teste no arquivo `spec/spec_runner.html`, logo abaixo do comentário `<!-- include spec files here... -->`. Você pode separar seus testes em diversos arquivos, ou pode usar um único arquivo para tudo.

Para executar os testes, basta abrir o arquivo `spec/spec_runner.html` no seu navegador.

## Enviando a sua solução

Para enviar a sua solução, faça um fork do projeto.

```bash
git clone https://github.com/fnando/form-validator-project.git
```

Depois, crie um branch com seu nome de usuário:

```bash
git checkout -b <seu usuário do Github>
git checkout -b fnando # Exemplo
```

Faça sua implementação nesse branch. Quando tiver finalizado, faça um commit com todas as suas alterações e envie para o Github.

```bash
git add .
git commit -m "Finish implementation"

git push origin <seu usuário do Github>
git push origin fnando # Exemplo
```

Finalmente, faça um pull request no Github, com sua implementação.
