import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import ReactStars from 'react-stars'
import Quantity from '../../components/Utilities/quantity/quantity'
import Product from '../../components/Product/product'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'
import SliderComponent from '../../components/Utilities/slider'
import Accordion, { AccordionItem } from '../../components/Utilities/accordion'

import LayoutContext from '../context'
import { productUrl } from '../../services/service.config'

import { HirmerButton } from '../../components/Utilities/button'
import {
  CurrencyBeforeComponent,
  CurrencyBeforeValue,
} from 'components/Utilities/common'
import { PriceTierValues } from './VariantAccordion'
import { useCart } from 'context/cart-provider'
import { useAuth } from 'context/auth-provider'
import { formatPrice } from 'helpers/price'
import { getLanguageFromLocalStorage } from 'context/language-provider'
import productService from '../../services/product/product.service'
import priceService from '../../services/product/price.service'
import { ProductVariantSelection } from './ProductVariantSelection'

const getRelatedProducts = async (language, product) => {
  let productIds = []
  const relatedItems = product.relatedItems
  if(!relatedItems ) return null

  relatedItems.forEach((item) => {
    productIds.push(item.refId)
  })
  const products = await productService.getProductsWithIds(productIds)
  const prices = await priceService.getPriceWithProductIds(productIds)
  
  const prices_obj = {}
  prices.forEach((p) => {
    prices_obj[`p${p.itemId.id}`] = p
  })
  
  let price_id
  let result = []
  for (let i = 0; i < products.length; i++) {
    price_id = `p${products[i]['id']}`
    if (prices_obj[price_id] !== undefined)
      result.push({
        id: products[i].id,
        code: products[i].code,
        name: prices_obj[price_id].itemId?.name[language] || "",
        price: prices_obj[price_id].effectiveValue,
        listprice: prices_obj[price_id].effectiveValue,
        src: products[i].media[0].url
      })
  }
  return result
}

const ProductContext = createContext()

const Bold = ({ children }) => {
  return <div className="font-bold">{children}</div>
}
const ProductDetailCategoryCaptionBar = ({ category }) => {
  const categoryTree = [{ caption: 'Home', link: productUrl() }]
  let lnk = productUrl()
  for (let c in category) {
    lnk = `${lnk}/${category[c].toLowerCase().replaceAll(' ', '_')}`
    categoryTree.push({ caption: category[c], link: lnk })
  }
  return (
    <div className="product-detail-category-caption-bar flex justify-center">
      <Breadcrumbs
        className="lg:block hidden"
        separator="/"
        aria-label="breadcrumb"
      >
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            <Typography
              key={index}
              className="breadcrumb-item"
              color="text.primary"
            >
              {row.caption}
            </Typography>
          ) : (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color="inherit"
              href={row.link}
            >
              {index !== categoryTree.length - 1 ? (
                row.caption
              ) : (
                <Bold>
                  <span className="text-blue">{row.caption}</span>
                </Bold>
              )}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs
        className="lg:hidden md:block hidden"
        separator="/"
        aria-label="breadcrumb"
      >
        {categoryTree.map((row, index) => {
          return row.link === '' ? (
            ''
          ) : (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color={
                index === categoryTree.length - 2 ? 'text.primary' : 'inherit'
              }
              href="/"
            >
              {row.caption}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs className="md:hidden" separator="|" aria-label="breadcrumb">
        {categoryTree.map((row, index) => {
          return categoryTree.length - index > 1 &&
            categoryTree.length - index < 4 ? (
            <Link
              key={index}
              className="breadcrumb-item"
              underline="hover"
              color={
                index === categoryTree.length - 1 ? 'text.primary' : 'inherit'
              }
              href="/"
            >
              {row.caption}
            </Link>
          ) : (
            ''
          )
        })}
      </Breadcrumbs>
    </div>
  )
}

const ProductImage = ({ product }) => {
  return (
    <div className="product-detail-image-content">
      <div className="product-detail-main-image rounded">
        <img src={`${product.src}`} alt="product" className="w-full" />
      </div>
      <div className="product-detail-sub-images">
        {product.subImages.map((link, index) => {
          return (
            <div
              key={index}
              className="rounded product-detail-sub-image-item flex items-center"
            >
              <img
                src={`${link}`}
                alt="product_"
                className="w-full m-auto items-center"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
const ProductSkuAndReview = ({ product }) => {
  return (
    <div className="flex justify-between items-end">
      <div className="sku-info">
        SKU:&nbsp;&nbsp;<span className="sku">{product.code}</span>
      </div>
      <div className="reviews-info">
        <div className="lg:flex">
          <div className="flex float-right lg:float-left lg:pb-0 pb-4">
            <ReactStars
              size={16}
              value={product.rating}
              color2={'#FBB13C'}
              className="reviews-star"
            />
            ({product.count})
          </div>
          <div className="lg:ml-4  product-all-reviews">Read All Reviews</div>
        </div>
      </div>
    </div>
  )
}
const ProductTitle = ({ name }) => {
  return <div className="mt-6 product-title">{name}</div>
}
const ProductPriceAndAmount = ({ price, productCount, estimatedDelivery, product }) => {
  const { isLoggedIn } = useAuth()

  return (
    <div className="product-price-and-amount-wrapper mt-12 ">
      <div className="product-price-wrapper flex space-x-4 items-center">
        {price !== '' ? (
          <>
            <div className="product-price h-12">
              <CurrencyBeforeValue value={price} />
            </div>
            <div className="vat-caption">
              {isLoggedIn ? 'VAT Excluded' : 'VAT Included'}
            </div>
          </>
        ) : (
          <></>
        )}
        {price !== null ? (
          <div className="list-price desktop-sm">
            {isLoggedIn ? 'Your negotiated price' : 'List Price'}{' '}
            <CurrencyBeforeComponent>
              <del>{price}</del>
            </CurrencyBeforeComponent>
          </div>
        ) : (
          <span className="desktop-sm text-xs  text-brightRed font-bold">
            No Price
          </span>
        )}
      </div>
      {product.productType === 'PARENT_VARIANT' && (
        <>
           <ProductVariantSelection product={product} />

        </>
      )}

      <div className="product-amount-wrapper flex mt-6 space-x-6 items-center">
        <span className="product-number">{productCount} in Stock</span>
        <span className="delivery-date">
          Estimated Delivery {estimatedDelivery}
        </span>
      </div>
    </div>
  )
}
const ProductBasicInfo = ({ product }) => {
  const { isLoggedIn } = useAuth()
  const price = useMemo(() => {
    return formatPrice(product, isLoggedIn)
  }, [isLoggedIn, product])

  return (
    <div className="product-basic-info-wrapper hidden lg:block">
      <ProductSkuAndReview product={product} />
      <ProductTitle name={product.name} />
        <ProductPriceAndAmount
          price={price}
          productCount={product.product_count}
          estimatedCelivery={product.estimated_delivery}
          product={product}
        />
    </div>
  )
}

const PrdouctAddToCart = () => {
  const product = useContext(ProductContext)
  const { setShowCart } = useContext(LayoutContext)
  const [quantity, setQuantity] = useState(1)
  const { syncCart, putCartProduct } = useCart()
  const HandleProductAddToCart1 = useCallback((product, action, quantitiy) => {
    let newProduct = { ...product }
    newProduct.quantity = quantitiy
    putCartProduct(newProduct)
    syncCart()
    action(true)
  }, [])

  const increaseQty = () => {
    setQuantity((prevState) => prevState + 1)
  }

  const decreaseQty = () => {
    if (quantity <= 1) return
    setQuantity((prevState) => prevState - 1)
  }

  return (
    <div className="product-add-to-cart-wrapper py-12">
      <div className="quantity">
        Quantity
        <Quantity
          value={quantity}
          increase={increaseQty}
          decrease={decreaseQty}
        />
      </div>
      <div className="">
        <HirmerButton
          disabled={!product.price}
          className="product-add-to-cart-btn"
          onClick={() =>
            HandleProductAddToCart1(product, setShowCart, quantity)
          }
          title="ADD TO CART"
        />
      </div>
    </div>
  )
}
const ProductDiscount = ({ price, quantity }) => {
  return (
    <div className="product-discount-wrapper pt-12 gap-6 ">
      <div className="product-discount-caption">Quantity Discount</div>
      <PriceTierValues
        sx={{ borderRight: '1px solid #DFE1E5' }}
        price={price}
        quantity={quantity}
      ></PriceTierValues>
    </div>
  )
}
const ProductInfo = ({ product }) => {
  return (
    <>
      <ProductBasicInfo product={product} />
      {product.productType !== 'PARENT_VARIANT' && (
        <>
          <PrdouctAddToCart />
          <ProductDiscount
            price={product.price}
            quantity={product.product_count}
          />
        </>
      )}
    </>
  )
}

const ProductContent = ({ product, brand, labels }) => {
  let price = '',
    listPrice = ''
  if (product.price !== undefined) {
    listPrice = Math.trunc(product.price.totalValue * 100) / 100
    price = listPrice
    if (
      product.price.priceModel !== undefined &&
      product.price.priceModel.includesTax === false
    ) {
      price =
        Math.trunc((price * 10000) / (100 + product.price.tax.taxRate)) / 100
    }
  }
  return (
    <ProductContext.Provider value={product}>
      <div className="product-content-wrapper">
        <div className="mobile-lg">
          <ProductSkuAndReview product={product} />
          <ProductTitle name={product.name} />
        </div>
        <div className="product-image-wrapper">
          <ProductImage product={product} />{' '}
          <div className="grid grid-cols-2 mt-2">
            <div className="flex flex-col">
              {brand && (
                <>
                  <div>Brands</div>
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-fit h-8"
                  />
                </>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex gap-2">
                {labels && labels.length > 0 && <div>Labels</div>}
                {labels.map((label) => {
                  return (
                    <img
                      src={label.image}
                      alt={label.name}
                      className="w-fit h-8"
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-price-and-amount-wrapper">
          <ProductPriceAndAmount
            price={price}
            listPrice={listPrice}
            product_count={product.product_count}
            estimated_delivery={product.estimated_delivery}
            product={product}
          />
        </div>
        <div className="product-info-wrapper">
          <ProductInfo product={product} />
        </div>
      </div>
    </ProductContext.Provider>
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const ProductDetailsTabContent = ({ product }) => {
  const getFeatureName = (str) => {
    let loop = 0
    let res = ''
    let flg = false
    while (loop < str.length) {
      if (loop === 0) res += str[loop].toUpperCase()
      else {
        if (!isNaN(str[loop] * 1)) res += str[loop]
        else {
          if (str[loop] === '_') flg = true
          else {
            if (flg === true || str[loop] === str[loop].toUpperCase())
              res += ' ' + str[loop].toUpperCase()
            else res += str[loop]
            flg = false
          }
        }
      }
      loop++
    }
    return res
  }
  const getAttributes = (items) => {
    let res = []
    Object.keys(items).map((key) => {
      let value = items[key]
      let caption = getFeatureName(key)
      if (typeof value !== 'object') value = value
      else if ('value' in value && 'uom' in value)
        value = value['value'] + ' ' + value['uom']
      else value = ''
      res.push({ property: caption, value: value })
    })
    return res
  }
  
  return (
    <div className='product-details-tab-content'>
      <div className="product-details-tab-content-wrapper">
        <div className="grid grid-cols-1 gap-12">
          {Object.keys(product.mixins).filter(key => key !== 'hirmerAttributes').map((key) => {
            return (
              <ProductInfoPortal
                key={key}
                caption={getFeatureName(key)}
                items={getAttributes(product.mixins[key])}
                description={product.description}
              />
            )
          })}
        </div>
      </div>

      <ProductCareInstructions product={product} />
  

    </div>
  )
}

const ProductDetailTabContent = ({ product }) => {
  const [tab, setTab] = React.useState(0)

  const handleChange = (event, tab) => {
    setTab(tab)
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }

  const tabStyle = {
    color: '#ACAEB2',
    fontSize: '20px',
    lineHeight: '32px',
    fontHeight: 500,
    paddingTop: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingBottom: '8px',
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={handleChange}
          aria-label=""
        >
          <Tab sx={tabStyle} label="Details" {...a11yProps(0)} />
          <Tab sx={tabStyle} label="Reviews" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <ProductDetailsTabContent product={product} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        Reviews
      </TabPanel>
    </Box>
  )
}
const ProductInfoPortal = ({ description, caption, items }) => {
  return (
    <div className="information-portal-wrapper grid grid-cols-1 gap-4">
      <div className="information-caption">{caption}</div>
      <div className="information-content grid grid-cols-1 gap-[6px]">
      <div className="information-content-product" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  )
}

const ProductCareInstructions =({product}) => {
    return (
      <>
      {product.mixins.hirmerAttributes?.care_instructions && Array.isArray(product.mixins.hirmerAttributes.care_instructions) ? 
      <div className="product-details-tab-content-care-wrapper">
        <div className="information-portal-wrapper grid grid-cols-1 gap-4">
          <div className="information-caption">Care Instructions</div>
          <div className='product-details-tab-content-care-instruction'>
            {
            (product.mixins.hirmerAttributes?.care_instructions).map((instruction) => {
                return (
                  <>
                    <img className='' src={require(`../../assets/${instruction.care_instructions_icon_image}`)}/>
                    <span>{instruction.care_instructions_name}</span>
                  </>
                )
              })}

          </div>
        </div>
      </div> : null
    }
    </>
    )
}

const ProductDetailInfo = ({ product }) => {
  return (
    <div className="product-detail-page-info-wrapper lg:py-12 pb-12">
      <div className="product-detail-content">
        <div className="desktop-lg">
          <ProductDetailTabContent product={product} />
        </div>
        <div className="mobile-lg">
          <Accordion>
            <AccordionItem index={0} title="Details">
              <ProductDetailsTabContent product={product} />
            </AccordionItem>
            <AccordionItem index={2} title="Reviews">
              Reviews
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

const ProductMatchItems = ({productInput}) => {
  const [products, setProducts] = useState([]); 
  const language = getLanguageFromLocalStorage()

  useEffect(() => {
    getRelatedProducts(language, productInput).then(result => {
        result ? setProducts(result.slice(0, 5)) : setProducts([])
    })
  },[language])
  
  return (
    <>
      {products.length > 0 && 
      <div className="product-match-items-wrapper grid grid-cols-1">
        <div className="product-match-caption w-full p-0">Match it with</div>
        <div className="product-match-items-content w-full">
          <SliderComponent>
            {products.map((item) => (
              <Product
                id={item.id}
                key={item.id}
                src={item.src}
                code={item.code}
                name={item.name}
                price={item.price}
                listPrice={item.listPrice}
              />
            ))}
          </SliderComponent>
        </div>
      </div>
      }
    </>
  )
}

const ProductDetailPage = ({ product, brand, labels }) => {
  return (
    <div className="product-detail-page-wrapper ">
      <div className="product-detail-page-content">
        <ProductDetailCategoryCaptionBar category={product.category} />
        <ProductContent product={product} brand={brand} labels={labels} />
        
        <ProductDetailInfo product={product} />
        <ProductMatchItems productInput={product}/>
      </div>
    </div>
  )
}
export default ProductDetailPage
