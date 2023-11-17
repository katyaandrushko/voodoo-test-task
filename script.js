// Sample array of products

const shopifyRoot = 'https://voodoo-sandbox.myshopify.com/'

const getProducts = async () => {
  const response = await fetch(
    //shopifyRoot + 'products.json?limit=461'
    'product.json'
  )
  return await response.json()
}

const getRecommendedProducts = async (productId) => {
  let link =
    shopifyRoot +
    'recommendations/products.json?product_id=' +
    productId +
    '&limit=4'

  const response = await fetch('recommendedProducts.json')
  return await response.json()
}

const closePreview = () => {
  const productsPreview = document.getElementById('products-preview')
  productsPreview.className += ' hidden'
}

const itemsPerPage = 9
let currentPage = 1

const displayProducts = async (page) => {
  const products = await getProducts()
  const startIndex = (page - 1) * itemsPerPage
  const endIndex =
    startIndex + itemsPerPage > products.length
      ? products.length
      : startIndex + itemsPerPage

  const productsSlice = products.products.slice(startIndex, endIndex)

  const productList = document.getElementById('products')
  productList.innerHTML = '' // Clear previous products

  for (const product of productsSlice) {
    const productItem = document.createElement('div')

    const images = product.images
    let src = './img/product.png'
    if (images != undefined && images.length > 0) {
      const image = images[0]
      src = image.src
    }

    const imgEl = document.createElement('img')
    imgEl.src = src
    imgEl.className = 'rounded-2xl'
    productItem.appendChild(imgEl)

    const pEl = document.createElement('p')
    pEl.className = 'mt-2'
    pEl.innerText = product.title

    const starsDiv = document.createElement('div')
    starsDiv.className = 'flex items-center mt-2'
    for (let i = 0; i < 5; i++) {
      const starImg = document.createElement('img')
      starImg.src = './img/Star.png'
      starsDiv.appendChild(starImg)
      starImg.className = 'stars'
    }

    const pRating = document.createElement('p')
    pRating.className = 'mr-2 pl-3'
    pRating.innerText = '5'
    starsDiv.appendChild(pRating)

    const productVariants = product.variants
    let productPrice = '$0'
    let productColor = 'grey'
    let productSize = 'small'
    if (productVariants != undefined && productVariants.length > 0) {
      const firstVariant = productVariants[0]
      productPrice = firstVariant.price
      productColor = firstVariant.option2
      productSize = firstVariant.option1
    }

    const pPrice = document.createElement('p')
    pPrice.className = 'mt-2'
    pPrice.innerText = productPrice

    productItem.appendChild(pEl)
    productItem.appendChild(starsDiv)
    productItem.appendChild(pPrice)
    productList.appendChild(productItem)

    productItem.onclick = async () => {
      const productsPreview = document.getElementById('products-preview')
      productsPreview.className = 'flex items-center justify-center'

      const maincontent = document.getElementById('maincontent')
      maincontent.innerHTML = ''

      const prevTitle = document.createElement('h1')
      prevTitle.className = 'title-prev font-black text-4xl mt-4'
      prevTitle.innerText = product.title
      maincontent.appendChild(prevTitle)

      const priceDiv = document.createElement('div')
      priceDiv.className = 'mt-5 mb-3 flex items-center'
      const priceSpan = document.createElement('span')
      priceSpan.id = 'price' + product.id
      priceSpan.className = 'price-prev text-3xl font-bold text-dark-cyan'
      priceSpan.innerText = productPrice
      priceDiv.appendChild(priceSpan)
      maincontent.appendChild(priceDiv)

      const descP = document.createElement('p')
      descP.className = 'text-very-dark-blue font-montserrat mt-5 text-xl'
      descP.innerText = product.title
      maincontent.appendChild(descP)

      const selectColorsDiv = document.createElement('div')
      selectColorsDiv.className = 'pt-4'
      const selectColorsDividerDiv = document.createElement('div')
      selectColorsDividerDiv.className = 'ddd mb-5'
      selectColorsDiv.appendChild(selectColorsDividerDiv)
      const selectColorsSpan = document.createElement('span')
      selectColorsSpan.className = 'text-xl'
      selectColorsSpan.innerText = 'Select Colors'
      selectColorsDiv.appendChild(selectColorsSpan)
      maincontent.appendChild(selectColorsDiv)

      const colorsDiv = document.createElement('div')
      colorsDiv.className = 'colors flex gap-4 pt-2'

      const options = product.options
      const sizeCont = options.find((o) => o.name == 'Size')
      const colorCont = options.find((o) => o.name == 'Color')
      let currentColor = ''
      let currentSize = ''

      const colorDivs = []
      const colorTicks = []

      if (colorCont != undefined) {
        const colors = colorCont.values

        for (const color of colors) {
          const colorDiv = document.createElement('div')
          colorDiv.id = color
          colorDiv.className =
            'w-11 h-11 flex rounded-full justify-center items-center border-solid border-2 border-opacity-20 border-black mb-4 ' +
            'bg-' +
            color.toLowerCase()

          const tickSvg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
          )
          const useSvg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'use'
          )
          tickSvg.classList.add('hidden')
          tickSvg.setAttribute('class', 'z-20')
          tickSvg.setAttribute('id', color)
          tickSvg.setAttribute('width', '16px')
          tickSvg.setAttribute('height', '16px')
          useSvg.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'href',
            './img/Frame.svg'
          )

          tickSvg.appendChild(useSvg)
          colorDiv.appendChild(tickSvg)
          colorsDiv.appendChild(colorDiv)

          colorDivs.push(colorDiv)
          colorTicks.push(tickSvg)
        }
      }

      const setNewPrice = (size, color) => {
        const curPriceSpan = document.getElementById('price' + product.id)
        const newPrice = variants.find(
          (v) => v.option1 == size && v.option2 == color
        )
        if (newPrice != undefined) {
          curPriceSpan.innerText = newPrice.price
        }
      }

      colorDivs.forEach((colorDiv) => {
        colorDiv.addEventListener('click', () => {
          colorTicks.forEach((colorTick) => {
            if (colorTick.id == colorDiv.id) {
              colorTick.classList.remove('hidden')
              currentColor = colorDiv.id
              setNewPrice(currentSize, currentColor)
            } else {
              colorTick.className = 'hidden'
            }
          })
        })
      })

      maincontent.appendChild(colorsDiv)

      const selectSizesDiv = document.createElement('div')
      selectSizesDiv.className = 'pt-4'
      const selectSizesDividerDiv = document.createElement('div')
      selectSizesDividerDiv.className = 'ddd mt-0 mb-3'
      selectSizesDiv.appendChild(selectSizesDividerDiv)
      const selectSizesSpan = document.createElement('span')
      selectSizesSpan.className = 'text-xl'
      selectSizesSpan.innerText = 'Choose Size'
      selectSizesDiv.appendChild(selectSizesSpan)
      maincontent.appendChild(selectSizesDiv)

      const sizesDiv = document.createElement('div')
      sizesDiv.className = 'size flex gap-4 pt-2'

      const sizesDivs = []

      if (sizeCont != undefined) {
        const sizes = sizeCont.values

        for (const size of sizes) {
          const sizeDiv = document.createElement('div')
          sizeDiv.id = size
          sizeDiv.className =
            'size-btn flex items-center justify-center bg-gray-200 rounded-full'
          sizeDiv.style = 'width: 102px; height: 38px'

          const sizeP = document.createElement('p')
          sizeP.className =
            'textprice opacity-60 text-base font-normal leading-normal'
          sizeP.innerText = size

          sizeDiv.appendChild(sizeP)
          sizesDiv.appendChild(sizeDiv)
          sizesDivs.push(sizeDiv)
        }
      }

      const variants = product.variants

      sizesDivs.forEach((sizeDiv) => {
        sizeDiv.addEventListener('click', () => {
          sizesDivs.forEach((otherSizeDiv) => {
            if (sizeDiv.id == otherSizeDiv.id) {
              sizeDiv.classList.add('active')
              currentSize = sizeDiv.id
              setNewPrice(currentSize, currentColor)
            } else {
              otherSizeDiv.classList.remove('active')
            }
          })
        })
      })

      maincontent.appendChild(sizesDiv)

      const actionsDivider = document.createElement('div')
      actionsDivider.className = 'ddd mt-5 mb-3'
      maincontent.appendChild(actionsDivider)

      const actionsDiv = document.createElement('div')
      actionsDiv.className =
        'containerbrn flex items-center justify-between font-bold text-white w-full py-3'

      const amountButton = document.createElement('button')
      const addButton = document.createElement('button')
      amountButton.className = 'number bg-black'
      addButton.className = 'addtocard bg-black'
      amountButton.innerText = '- 1 +'

      addButton.innerText = 'Add to Cart'

      actionsDiv.appendChild(amountButton)
      actionsDiv.appendChild(addButton)
      maincontent.appendChild(actionsDiv)

      const youMightLikeProds = document.getElementById('youMightLikeProds')
      const recommendedProductsPromise = await getRecommendedProducts(
        product.id
      )
      const recommendedProducts = recommendedProductsPromise.products

      for (const recommendedProduct of recommendedProducts) {
        const recommendedProductDiv = document.createElement('div')
        const recommendedProductImg = document.createElement('img')
        recommendedProductImg.className = 'product rounded-2xl'
        recommendedProductImg.src = './img/shhop.png'
        const recommendedProductTitle = document.createElement('p')
        recommendedProductTitle.className = 'mt-2'
        recommendedProductTitle.innerText = recommendedProduct.title

        const recommendedProductPriceP = document.createElement('p')
        recommendedProductPriceP.className = 'mt-2'
        const recommendedProductVariants = recommendedProduct.variants
        let recommendedProductPrice = '$0'
        if (recommendedProductVariants != undefined) {
          const firstVariant = recommendedProductVariants[0]
          recommendedProductPrice = firstVariant.price
        }
        recommendedProductPriceP.innerText = recommendedProductPrice
        recommendedProductDiv.appendChild(recommendedProductImg)
        recommendedProductDiv.appendChild(recommendedProductTitle)
        recommendedProductDiv.appendChild(recommendedProductPriceP)

        youMightLikeProds.appendChild(recommendedProductDiv)
      }
    }
  }
}

async function displayPagination() {
  const productsResponse = await getProducts()
  const products = productsResponse.products
  const totalPages = Math.ceil(products.length / itemsPerPage)

  const ulEl = document.getElementById('ull')
  ulEl.innerHTML = ''

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('li')
    pageLink.className = `${currentPage === i ? 'link active' : 'link'}`

    if (i > currentPage + 1 && i < totalPages - 1) {
      pageLink.textContent = '...'
      i = totalPages - 2
    } else if (currentPage >= 4 && i != 1 && i < currentPage - 1) {
      pageLink.textContent = '...'
      i = currentPage - 2
    } else {
      pageLink.textContent = i
      pageLink.addEventListener('click', () => {
        currentPage = i
        displayProducts(currentPage)
        displayPagination()
      })
    }

    ulEl.appendChild(pageLink)
  }
}

// Initial display
displayProducts(currentPage)
displayPagination()
