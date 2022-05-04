let cart = [];   //é o array naqual vamos add as pizzas ao carrinho (quantidade, tamanho).
let modalQt = 1;
let modalKey = 0;

const c = (el) =>document.querySelector(el);        //vai retornar o item.
const cs = (el)=>document.querySelectorAll(el);     //vai retornar um array (mais de um ítem)


//------------LISTAGEM DAS PIZZAS------------------------------------------------------------------------------

pizzaJson.map((item, index)=>{              /*.map(): Usado quando queremos acessar todos os elementos de um Array (um por um)
                                            e realizar modificações. No caso, usamos essa função para acessar o array pizzaJson.*/

    let pizzaItem = c('.models .pizza-item').cloneNode(true);    //Essa linha vai clonar a class '.pizza-item' para 'pizzaItem'. Após isso, temos q add esta na arvore DOM através de append (linha 20).

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;           //repetiu a tag img para dizer q está selecionando ela.
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault();                                                //Vai bloquear o o evento de clicar na pizza e ir para outra página.
        let key = e.target.closest('.pizza-item').getAttribute('data-key');   //O closest é usado para q a função ache e acesse o elemento mais próximo informado, no caso o .pizza-item. Assim, ele sai do elemento 'a' e vai procurar o .pizza-item. Já o getAttribute vai funcionar como uma chave, pegando assim o o elemento do setAttribute.
        modalQt = 1;            //vai zerar o modal para a quantidade 1 sempre q o modal for aberto.
        modalKey = key;         //variável q, ao clicar, vai nos informar qual é a pizza q foi clicada.
        c('.pizzaBig img').src = pizzaJson[key].img; 
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');  //O classList.remove vai remover a class selected q ficaria permanentemente selecionado. 
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{         //Se você simplesmente quer mostrar todos os dados na tela, use o forEach, se você quer transforma-los em outra coisa use o map (ex: multiplicar todos os itens por 2)
            if(sizeIndex==2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];   //Para acessar as informações sobre tamanho da pizza, usamos o seguinte código: pizzaJson[key].sizes[sizeIndex]
        })
        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display='flex'; 
            setTimeout(()=>{
                c('.pizzaWindowArea').style.opacity = 1;
            }, 200);
    });
    

    c('.pizza-area').append(pizzaItem);                            //O append vai add o clone pizzaItem no HTML (árvore DOM). 
});

//----------EVENTOS DO MODAL----------------------------------------------------------------------------------

function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout (() =>{
    c('.pizzaWindowArea').style.display='none'; 
    }, 500);
}
    cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)                                       //Ao apertar nos botões das duas classes acima, vai add o evento de fechar o modal.
})
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }
    
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{         
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected'); 
        size.classList.add('selected');                                              //usamos o size e não o e.target para poder garantir q sempre estaremos selecionando um ítem da classList pizzaInfo--size.selected.
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //As informações necessárias saber para add a pizza no carrinho são as seguintes: 1.Qual a pizza?; 2.Qual o tamanho; 3.Quantas pizzas?
    console.log('Pizza: ' +modalKey);
    
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    //Antes de add no carrinho, precisamos verificar se o carrinho já tem uma pizza com o mesmo identificador. Caso tenha, não vamos dá um push, mas sim add outro identificador da seguinte maneira:
    let key = cart.findIndex((item)=>item.identifier == identifier);  //utilizamos o == pq estamos fazendo uma verificação.
    //Ou seja, add o item no carrinho e vamos verificar no carrinho se o identifier de lá possui o mesmo identifier do q acabamos de add. Caso encontre, será retornado o index dele (key). Se não encontrar, será retornado o - 1.
    if(key > -1){   
        cart[key].qt += modalQt;                                                     //Assim, caso ache o mesmo identifier, será modificado apenas a quantidade. Caso não ache, entra no cart.push eserá add ao carrinho.
    }else {
        cart.push ({                                                                  //usado para add no array do carrinho
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }

    
    updateCart();                                                                    //Sempre q o carrinho for atualizado ou ao se add um item novo, será executada a função updateCart() e vai atualizar o carrinho.
    closeModal();                                                                    //Vai fechar o Modal.
    
});
c('.menu-openner').addEventListener('click', () =>{
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', () =>{
    c('aside').style.left = '100vw';
});


function updateCart() {                                                           //Função q vai atualizar o carrinho.
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {                                                        //Informa se tem itens no carrinho. Se tem, vai mostrar o carrinho
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''                                                  //Fazemos isso para zerar as pizzas sempre q o updateCart atualizar.

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {                                                      //Vamos utilizar o for para pegar item por item e exibir no carrinho.
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);       //Assim, vamos procurar o id do item dentro de Json e vamos retornar pizzaItem. OBS: não é findIndex 
            subtotal += pizzaItem.price*cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);             //Usado para clonar o cart--item e exibi-lo na tela.

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;

                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2: 
                    pizzaSizeName = 'G';
                    break;
            }


            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;                //Vai add o tamanho entre parênteses (P, M, G) ao lado do nome da pizza.

            cartItem.querySelector('img').src = pizzaItem.img;                     //Vai add a imagem da pizza.
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;      //Vai add o nome da pizza.
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;      //Vai add a quantidade certa de pizzas selecionadas ao carrinho.
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{       //Vai fazer funcionar os botões de add itens de dentro do carrinho.

                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);                                                 //Vai remover o item do carrinho caso a quantidade seja menor do q 1.
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{         //Vai fazer funcionar os botões remover itens de dentro do carrinho.
                cart[i].qt++;                                                       //Vai add itens.
                updateCart();                                                       //Vai reatualizar o carrinho toda vez q apertar nos botões mais ou menos, atualizando, inclusive, os preços.
            });
            c('.cart').append(cartItem);                                           //Usamos o append para add as pizzas (itens) dentro da class .cart.
            desconto = subtotal*0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`; // O last-child foi usado para poder selecionar o último span da class .subtotal.
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        }
    } else {                                                                        //Caso não tenha, o carrinho será removido da tela.
        c('aside').classList.remove('show');                                        //Fecha o carrinho no computador
        c('aside').style.left = '100vw';                                           //Fecha o carrinho no celular.
    }
}