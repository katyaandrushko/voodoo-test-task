const shopifyRoot = 'https://voodoo-sandbox.myshopify.com/'

const getProducts = async () => {
   const response = await fetch(shopifyRoot + 'products.json?limit=461')
   return await response.json()
}

const getRecommendedProducts = async (productId) => {
   let link =
      shopifyRoot + 'recommendations/products.json?product_id=' + productId

   const response = await fetch('recommendedProducts.json')
   return await response.json()
}

const closePreview = () => {
   const sectionPreview = document.getElementById('products-preview')
   sectionPreview.classList.toggle('hidden')
   sectionPreview.classList.toggle('flex')
}

let itemsPerPage = window.innerWidth >= 1024 ? 9 : 6
let currentPage = 1

addEventListener('resize', () => {})

const insertColors = (colorCont, currentColor) => {
   let result = ''

   if (colorCont != undefined) {
      const colors = colorCont.values

      for (const color of colors) {
         let hidden = color == currentColor ? '' : 'hidden'
         result += `
            <div id=${color} class="color flex items-center justify-center">
               <div
                  class="relative w-9 h-9 rounded-full border-solid border-2 border-opacity-20 border-black"
                  style="background-color: ${color.toLowerCase()};"
               ></div>
               <img
                  id="${color}"
                  src="./img/tick.svg"
                  alt=""
                  class="filter-black absolute ${hidden} flex items-center justify-center  "
               />

        
            </div>
         `
      }
   }

   return result
}

const insertSizes = (sizeCont, currentSize) => {
   let result = ''

   if (sizeCont != undefined) {
      const sizes = sizeCont.values

      for (const size of sizes) {
         let active = size == currentSize ? 'active' : ''

         result += `
            <div
               id="${size}"
               class="size ${active} flex items-center justify-center bg-gray-200 rounded-full px-5"
               style="width: 102px; height: 38px"
            >
               <p
                  class="textprice text-base font-normal leading-normal"
               >${size}</p>
            </div>
         `
      }
   }
   return result
}

const getPercentage = (price, comparedPrice) => {
   return Math.round((1 - price / comparedPrice) * 100)
}

function changeCount() {
   const count = document.getElementById('count')

   let value = parseInt(count.textContent)
   if (this.getAttribute('value') === '+') {
      value++
      count.textContent = value
   }
   if (value === 1) {
      return
   }
   if (this.getAttribute('value') === '-') {
      value = value - 1
      count.textContent = value
   }
}

const insertRecommendedProducts = async (productId) => {
   const recommendedProductsPromise = await getRecommendedProducts(productId)
   const recommendedProducts = recommendedProductsPromise.products

   let result = ''

   for (const recommendedProduct of recommendedProducts) {
      const images = recommendedProduct.images
      let recommendedProductSrc = './img/product.png'
      if (images != undefined && images.length > 0) {
         const image = images[0]
         recommendedProductSrc = image.src ?? recommendedProductSrc
      }

      const recommendedProductVariants = recommendedProduct.variants
      let recommendedProductPrice = 0
      let recommededProductComparedPrice = 0
      if (
         recommendedProductVariants != undefined &&
         recommendedProductVariants.length > 0
      ) {
         const firstVariant = recommendedProductVariants[0]
         recommendedProductPrice =
            firstVariant.price ?? recommededProductComparedPrice
         recommededProductComparedPrice =
            firstVariant.compare_at_price ?? recommededProductComparedPrice
      }
      result += `
         <div class="alsolike-prod w-96">
            <div class="img-prev-container">
               <img
                  class="product rounded-2xl"
                  src=${recommendedProductSrc}
                  style= "width: 300px"
               />
            </div>
            <p class="mt-2 text-ellipsis">${recommendedProduct.title}</p>
            <div class="flex gap-2 items-center pt-2">
               ${insertProductPrice(
                  recommendedProductPrice,
                  recommededProductComparedPrice,
                  'text-base',
                  'text-xs percent-disc '
               )}
            </div>
         </div>
      `
   }

   return result
}

const insertProductPrice = (
   productPrice,
   productComparedPrice,
   mainText,
   smallText
) => {
   if (productComparedPrice == null || productComparedPrice <= productPrice) {
      return `
         <h5 class="price font-bold ${mainText}">$${Math.ceil(
         productPrice
      )}</h5>
      `
   }

   return `
      <h5 class="price font-bold ${mainText}">$${Math.ceil(productPrice)}</h5>
      <h5
         class="disc-price text-gray-400 font-bold ${mainText} line-through"
      >
         $${Math.ceil(productComparedPrice)}
      </h5>
      <span class="text-red-500 bg-red-100 ${smallText} px-2 rounded-full"
         >-${getPercentage(productPrice, productComparedPrice)}%</span
      >
   `
}

const displayProducts = async (page) => {
   const productsData = await getProducts()

   if (productsData) {
      const products = productsData.products
      const startIndex = (page - 1) * itemsPerPage
      const endIndex =
         startIndex + itemsPerPage > products.length
            ? products.length
            : startIndex + itemsPerPage

      const productsSlice = products.slice(startIndex, endIndex)

      document.getElementById('sort-show').innerText = `Showing ${
         startIndex + 1
      }-${endIndex} of ${products.length} Products`

      const productsResult = document.getElementById('products')
      productsResult.innerHTML = ''

      for (const product of productsSlice) {
         const images = product.images
         let src = './img/product.png'
         if (images != undefined && images.length > 0) {
            const image = images[0]
            src = image.src
         }

         const productVariants = product.variants
         let productPrice = 0
         let productComparedPrice = 0
         let productColor = ''
         let productSize = ''
         if (productVariants != undefined && productVariants.length > 0) {
            const firstVariant = productVariants[0]
            productPrice = firstVariant.price ?? productPrice
            productColor = firstVariant.option2 ?? productColor
            productSize = firstVariant.option1 ?? productSize
            productComparedPrice =
               firstVariant.compare_at_price ?? productComparedPrice
         }

         const productItem = document.createElement('div')
         productItem.className = 'product-container'
         productItem.innerHTML = `
            <div class="img-wrapper">
               <img
                  src="${src}"
                  class="img-product rounded-2xl"
                  alt=""
               />
            </div>
            <p class="mt-2 font-bold">${product.title}</p>
            <div class="flex items-center mt-3">
               <img src="./img/Star.png" alt="" />
               <img src="./img/Star.png" alt="" />
               <img src="./img/Star.png" alt="" />
               <img src="./img/Star-.png" alt="" />
               <p class="mr-2 pl-3">3.5/5</p>
            </div>
            <div class="flex gap-2 items-center pt-2 pb-4">
               ${insertProductPrice(
                  productPrice,
                  productComparedPrice,
                  'text-xl',
                  'percent-disc'
               )}
            </div>
         `

         productItem.onclick = async () => {
            closePreview()

            const options = product.options
            const sizeCont = options.find((o) => o.name == 'Size')
            const colorCont = options.find((o) => o.name == 'Color')

            const productsPreview = document.getElementById(
               'products-preview-main'
            )
            productsPreview.innerHTML = `
               <div id="preview-container" class="flex flex-col">
                  <i onclick="closePreview()" class="fas fa-times"></i>
                  <div id="prev-top-content" class="flex items-center">
                     <div
                        class="imgcontainer w-1/2 flex justify-center items-center"
                     >
                        <img
                           class="rounded-xl"
                           src=${src}
                           alt="product image"
                        />
                     </div>

                     <div
                        id="maincontent"
                        class="m-auto w-full items-start lg:w-1/2 ml-10"
                     >
                        <h1 class="font-fraunces font-semibold text-2xl lg:text-5xl mt-4">
                           ${product.title}
                        </h1>
                        <div class="flex items-center mt-4 mb-1">
                           <img src="./img/Star.png" alt="" style="width: 25px" />
                           <img src="./img/Star.png" alt="" style="width: 25px" />
                           <img src="./img/Star.png" alt="" style="width: 25px" />
                           <img src="./img/Star-.png" alt="" style="width: 14px" />
                           <p class="mr-2 pl-3">3.5/5</p>
                        </div>
                        <div class="mt-5 mb-3 flex items-center">
                           <div id="preview-prices" class="flex gap-2 items-center">
                              ${insertProductPrice(
                                 productPrice,
                                 productComparedPrice,
                                 'text-3xl',
                                 'px-3.5 py-1.5 text-base font-medium'
                              )}
                           </div>
                        </div>
                        <p
                           class="text-very-dark-blue font-montserrat mt-3 text-lg opacity-60"
                        >
                           ${product.title}
                        </p>
                        <div class="pt-4">
                           <div class="ddd mb-3"></div>
                           <span class="text-lg opacity-60">Select Colors</span>
                        </div>
                        <div class="colors flex gap-4 pt-2">
                           ${insertColors(colorCont, productColor)}
                        </div>
                        <div class="pt-4">
                           <div class="ddd mt-0 mb-3"></div>
                           <span class="text-lg opacity-60">Choose Size</span>
                        </div>
                        <div class="sizes flex gap-4 pt-2 overflow-x-scroll">
                           ${insertSizes(sizeCont, productSize)}
                        </div>
                        <div class="ddd mt-5 mb-3"></div>

                        <div class="actions flex items-center justify-between">
                           <div id="quantity" class="sm:w-44">
                              <button class="min">
                                 <span
                                    value="-"
                                    id="decrement"
                                    class="text-base font-bold font-custom"
                                    onclick=""
                                    >—</span
                                 >
                              </button>
                              <span id="count" class="font-semibold">1</span>
                              <button class="plus" onclick>
                                 <span
                                    value="+"
                                    id="increment"
                                    class="text-3xl font-custom"
                                    >+</span
                                 >
                              </button>
                           </div>
                           <button class="add-cart">Add to Cart</button>
                        </div>
                     </div>
                  </div>
                  <div class="prevlike flex flex-col">
                     <h2 class="text-3xl font-bold items-start pb-5 pt-10">
                        You might also like
                     </h2>

                     <div id="youMightLikeProds" class="flex gap-16 overflow-x-scroll">
                        ${await insertRecommendedProducts(product.id)}
                     </div>
                  </div>
               </div>

            `

            const decrement = document.getElementById('decrement')
            const increment = document.getElementById('increment')

            increment.addEventListener('click', changeCount)
            decrement.addEventListener('click', changeCount)

            const setNewPrice = (size, color, mainText, smallText) => {
               const pricesDiv = document.getElementById('preview-prices')
               const newPrice = product.variants.find(
                  (v) => v.option1 == size && v.option2 == color
               )

               if (newPrice != undefined && newPrice.price != null) {
                  pricesDiv.innerHTML = insertProductPrice(
                     newPrice.price,
                     newPrice.compare_at_price,
                     mainText,
                     smallText
                  )
               }
            }

            //TODO: Fix that
            let allColors = document.querySelectorAll('.color')
            let allTicks = document.querySelectorAll('.color img')

            allColors.forEach((colorDiv) => {
               colorDiv.addEventListener('click', () => {
                  allTicks.forEach((colorTick) => {
                     if (colorTick.id == colorDiv.id) {
                        colorTick.classList.remove('hidden')
                        productColor = colorDiv.id
                        setNewPrice(
                           productSize,
                           productColor,
                           'text-3xl',
                           'px-3.5 py-1.5 text-base font-medium'
                        )
                     } else if (!colorTick.classList.contains('hidden')) {
                        colorTick.classList.add('hidden')
                     }
                  })
               })
            })

            let allSizesDivs = document.querySelectorAll('.size')
            let allSizesP = document.querySelectorAll('.size p')

            allSizesDivs.forEach((sizeDiv) => {
               sizeDiv.addEventListener('click', () => {
                  allSizesP.forEach((sizeP) => {
                     if (
                        sizeP.innerText == sizeDiv.id &&
                        !sizeDiv.classList.contains('active')
                     ) {
                        sizeDiv.classList.add('active')
                        productSize = sizeP.innerText
                        setNewPrice(
                           productSize,
                           productColor,
                           'text-3xl',
                           'px-3.5 py-1.5 text-base font-medium'
                        )
                     } else {
                        const otherDiv = document.getElementById(
                           sizeP.innerText
                        )
                        otherDiv.classList.remove('active')
                     }
                  })
               })
            })
         }

         productsResult.appendChild(productItem)
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

      if (window.innerWidth < 1024) {
         if (
            (currentPage == 1 || currentPage == totalPages) &&
            i > 2 &&
            i < totalPages - 1
         ) {
            pageLink.textContent = '...'
            i = totalPages - 2
         } else if (
            currentPage >= totalPages - 1 &&
            i < totalPages - 2 &&
            i > 1
         ) {
            pageLink.textContent = '...'
            i = currentPage - 2
         } else if (i > currentPage + 1 && i < totalPages) {
            i = totalPages - 1
            continue
         } else if (currentPage >= 3 && i != 1 && i < currentPage - 1) {
            i = currentPage - 2
            continue
         } else {
            pageLink.textContent = i
            pageLink.addEventListener('click', () => {
               currentPage = i
               displayProducts(currentPage)
               displayPagination()
            })
         }
      } else {
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
      }

      ulEl.appendChild(pageLink)
   }

   document.getElementById('prev-btn').onclick = async () => {
      if (currentPage > 0) {
         currentPage -= 1
         displayProducts(currentPage)
         displayPagination()
      }
   }
   document.getElementById('next-btn').onclick = async () => {
      if (currentPage < totalPages) {
         currentPage += 1
         displayProducts(currentPage)
         displayPagination()
      }
   }
}

// Initial display
displayProducts(currentPage)
displayPagination()
