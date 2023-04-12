import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
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

import { LargePrimaryButton } from '../../components/Utilities/button'
import {
  CurrencyBeforeComponent,
  CurrencyBeforeValue,
} from 'components/Utilities/common'
import { ProductVariants } from './ProductVariants'
import { PriceTierValues } from './VariantAccordion'
import { useCart } from 'context/cart-provider'
import { useAuth } from 'context/auth-provider'
import { formatPrice } from 'helpers/price'

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
    <div className="product-detail-category-caption-bar">
      <Breadcrumbs
        className="lg:block hidden"
        separator="|"
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
                <Bold>{row.caption}</Bold>
              )}
            </Link>
          )
        })}
      </Breadcrumbs>
      <Breadcrumbs
        className="lg:hidden md:block hidden"
        separator="|"
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
const ProductPriceAndAmount = ({ price, productCount, estimatedDelivery }) => {
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
      {product.productType !== 'PARENT_VARIANT' && (
        <ProductPriceAndAmount
          price={price}
          productCount={product.product_count}
          estimatedCelivery={product.estimated_delivery}
        />
      )}
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
        <LargePrimaryButton
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
  console.log('product:', product)
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
          {Object.keys(product.mixins).map((key) => {
            return (
              <ProductInfoPortal
                key={key}
                caption={getFeatureName(key)}
                items={getAttributes(product.mixins[key])}
              />
            )
          })}
        </div>
      </div>

      <div className="product-details-tab-content-separator"></div>

      <div className="product-details-tab-content-wrapper">
        <div className="information-caption">Care Instructions</div>
        <div className='product-details-tab-content-care-instruction'>

            <svg height="20" viewBox="0 0 21.34 20">
              <title>Care Do not bleach</title>
              <path d="M6.56 8.96l-4.964 8.58h1.7l-.92.92h-2.38L5.88 8.28l.68.68zm4.1-7.1l3.06 5.28.68-.68L10.66 0 6.94 6.46l.66.68 3.06-5.28zm8.3 16.6h2.38L15.46 8.28l-.7.68 4.98 8.58h-1.7zm-12.78-.92l-.92.92h10.82l-.94-.92zm11.06 0l-5.9-5.92 3.82-3.82 3.88-3.9-.64-.64-3.7 3.7-.7.66-3.34 3.36-3.32-3.36-.7-.66-3.7-3.7-.66.64 3.9 3.88.66.68 3.18 3.16-6.86 6.84-.88.9.66.64 7.72-7.72L18.396 20l.64-.64-.88-.9z"></path>
            </svg>
            <span>Nicht bleichen</span>
          
            <svg height="20" viewBox="0 0 19.52 20">
                <title>Care Do not tumble</title>
                <path d="M1.4 3.46v2.16a14.787 14.787 0 01.84-1.32l.78.78a8.14 8.14 0 00-1.62 4.9 8.242 8.242 0 001.78 5.12l-.78.76a9.979 9.979 0 01-1-1.52v2.54L.32 17.96V2.36l1.08 1.1zm11.32 15.42a9.129 9.129 0 002.62-1.38l-.76-.78a8.258 8.258 0 01-9.66.04l-.78.78a10.2 10.2 0 002.58 1.34h-3.9l-1.08 1.08h16.04l-1.08-1.08h-3.98zm6.7-.7V2.14l-1.08 1.1v3a10.464 10.464 0 00-1.1-1.9l-.78.78a8.245 8.245 0 01-.16 9.92l.76.78a9.368 9.368 0 001.28-2.1v3.38l1.08 1.08zm-1.08-.16l-1.7-1.7-.76-.78-5.34-5.38 6.28-6.32 1.52-1.52 1.08-1.1.1-.1-.1-.12-.68-.68-.76.76-1.94 1.96-.76.76-5.52 5.58L4.2 3.76 3.44 3l-1.9-1.92L.78.32.32.8 0 1.12l.32.32 1.08 1.1 2.02 2.02 5.56 5.6-5.38 5.42-.76.78L0 19.2l.32.34.46.46.06-.04 1.06-1.08 1.74-1.76.76-.76 5.36-5.4 5.32 5.36.76.78 2.9 2.9.78-.78-.1-.12-1.08-1.08zM6.72 1.08a9.332 9.332 0 00-2.78 1.5l.76.78a8.244 8.244 0 0110.08.04l.76-.78a9.206 9.206 0 00-2.82-1.54h4.36L18.14 0H1.38l1.06 1.08h4.28z"></path>
            </svg>
            <span>Nicht für Tumbler/Trockner geeignet</span>
            
            <svg height="20" viewBox="0 0 34.395 20">
              <title>Care Iron low temperature</title>
              <path d="M29.24 0H7.54v1.592h21.7c3.426 0 3.564 1.869 3.564 2.076v5.5H12.94a15.123 15.123 0 00-5.19 1.349 13.645 13.645 0 00-7.439 8.445L0 20h34.394V3.668a3.317 3.317 0 00-.968-2.288A5.661 5.661 0 0029.24 0zm3.564 18.408H2.249a11.8 11.8 0 016.125-6.4 14.886 14.886 0 014.637-1.211h19.792v7.612zM20.14 12.63a2.075 2.075 0 012.042 2.076 2.045 2.045 0 01-2.042 2.041 2.059 2.059 0 010-4.118z"></path>
            </svg>
            <span>Bügeln auf niedriger Stufe, ohne Dampf</span>
          
            <svg height="20" viewBox="0 0 28.703 20">
              <title>Care Permanent Press 30</title>
              <path d="M28.703.375L27.349 0l-.375 1.412a3.661 3.661 0 00-1.066-.519 4.054 4.054 0 00-3.948.947 3.206 3.206 0 01-3.112.692 3.1 3.1 0 01-1.47-.951A4.116 4.116 0 0015.56.461a4 4 0 00-4.15 1.124A3.037 3.037 0 019.02 2.68a3.179 3.179 0 01-2.277-.922 4.04 4.04 0 00-5.014-.259l-.4-1.5L0 .375l4.64 17.32.058-.029h19.28l.058.029L28.705.375zM1.96 2.334a3.267 3.267 0 012.1-.778 3.162 3.162 0 012.219.865 3.963 3.963 0 002.712 1.066 4.081 4.081 0 003-1.326 3.2 3.2 0 013.369-.921 3.436 3.436 0 011.383.836 3.907 3.907 0 001.873 1.239 4.074 4.074 0 003.89-.865 3.222 3.222 0 013.142-.81 3.683 3.683 0 011.1.605l-3.78 14.066H5.706L1.96 2.334zm5.1 16.456h14.035V20H7.06v-1.21zm3.228-6.34a3.832 3.832 0 01-1.614-.317v-.836a6.2 6.2 0 00.778.288 4.007 4.007 0 00.778.086 1.583 1.583 0 001.009-.231.911.911 0 00.346-.778.849.849 0 00-.375-.692 2.429 2.429 0 00-1.153-.2h-.518v-.778h.521q1.383 0 1.383-.951a.687.687 0 00-.259-.576 1.026 1.026 0 00-.72-.2 2.247 2.247 0 00-.634.086 2.892 2.892 0 00-.72.375l-.4-.663a3.206 3.206 0 011.873-.576 2.292 2.292 0 011.354.375 1.208 1.208 0 01.49 1.037 1.376 1.376 0 01-1.239 1.412v.058a1.582 1.582 0 011.037.432 1.262 1.262 0 01.346.922 1.5 1.5 0 01-.576 1.3 2.91 2.91 0 01-1.7.432zm5.418 0a1.635 1.635 0 001.5-.72 4.265 4.265 0 00.49-2.248 4.453 4.453 0 00-.49-2.277 1.721 1.721 0 00-1.5-.749 1.638 1.638 0 00-1.47.749 4.2 4.2 0 00-.49 2.248 4.006 4.006 0 00.49 2.248 1.641 1.641 0 001.47.749zm-.778-4.669a.831.831 0 01.778-.519.86.86 0 01.778.548 3.942 3.942 0 01.259 1.671 4.1 4.1 0 01-.259 1.7.779.779 0 01-.778.519.8.8 0 01-.778-.519 4.189 4.189 0 01-.231-1.7 4.017 4.017 0 01.231-1.7zm4.611 1.153a1.339 1.339 0 00.663.173 1.282 1.282 0 00.922-.375 1.261 1.261 0 00.375-.922 1.217 1.217 0 00-.375-.922 1.2 1.2 0 00-.922-.4 1.11 1.11 0 00-.922.4 1.217 1.217 0 00-.375.922 1.339 1.339 0 00.173.663 1.182 1.182 0 00.461.461zm.173-1.643a.632.632 0 01.49-.2.594.594 0 01.49.2.694.694 0 01.2.519.675.675 0 01-.2.49.7.7 0 01-.49.2.752.752 0 01-.49-.2.675.675 0 01-.2-.49.694.694 0 01.2-.519z"></path>
            </svg>
            <span>30° Schonwaschgang</span>
          
            <svg height="20" viewBox="0 0 18.98 20">
              <title>Care Gently cleaning with perchloroethylene</title>
              <path d="M18.98 9.48a9.49 9.49 0 10-10.26 9.46H3.2V20h12.66v-1.06h-5.6a9.515 9.515 0 008.72-9.46zm-9.5 8.46a8.45 8.45 0 118.46-8.46 8.459 8.459 0 01-8.46 8.46zM9.36 5.38H7.18v8.4h.98v-3.32h.98a3.958 3.958 0 002.5-.68 2.373 2.373 0 00.88-1.96c0-1.62-1.04-2.44-3.16-2.44zm1.56 3.84a3.222 3.222 0 01-1.88.42h-.88V6.2h1.1a2.8 2.8 0 011.7.42 1.458 1.458 0 01.54 1.24 1.54 1.54 0 01-.58 1.36z"></path>
            </svg>
            <span>Besonders schonend reinigen mit Perchlorethylen</span>

        </div>
      </div>
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
          <Tab sx={tabStyle} label="Additional Information" {...a11yProps(1)} />
          <Tab sx={tabStyle} label="Reviews" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <ProductDetailsTabContent product={product} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {product.description}
      </TabPanel>
      <TabPanel value={tab} index={2}>
        Reviews
      </TabPanel>
    </Box>
  )
}
const ProductInfoPortal = ({ caption, items }) => {
  return (
    <div className="information-portal-wrapper grid grid-cols-1 gap-4">
      <div className="information-caption">{caption}</div>
      <div className="information-content grid grid-cols-1 gap-[6px]">
        {items.map((row, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <div className="information-properties pl-6 grid grid-cols-1">
              <span key={index}>{row.property}</span>
            </div>
            <div className="information-values pl-6 grid grid-cols-1 ">
              <span key={index}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
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
            <AccordionItem index={1} title="Additional Information">
              {product.description}
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

const products = [
  {
    stock: 'Low',
    rating: 4,
    count: 8,
    src: '/products/hp_laser_printer.png',
    code: 'TY2-B#M74A',
    name: 'HP LaserJet 1*500-sheet Paper Feeder and Cabinet',
    price: '341.89',
    listPrice: '389.50',
  },

  {
    stock: 'In',
    rating: 4,
    count: 8,
    src: '/products/comfort_chair.png',
    code: 'BB2-B3M987',
    name: 'RP9 Retail Compact Stand Silver PC Multimedia stand',
    price: '84.89',
    listPrice: '94.10',
  },
  {
    stock: 'In',
    rating: 4,
    count: 8,
    src: '/products/pc_stand.png',
    code: 'BB2-B3M987',
    name: 'Zenith Plier stapler 548/E Silver',
    price: '27.50',
    listPrice: '34.99',
  },
  {
    stock: 'Low',
    rating: 4,
    count: 8,
    src: '/products/stapler.png',
    code: 'TY2-B#M74A',
    name: 'Comfort Ergo 2-Lever Operator Chairs',
    price: '53.59',
    listPrice: '59.99',
  },
  {
    stock: 'Low',
    rating: 4,
    count: 8,
    src: '/products/comfort_chair.png',
    code: 'TY2-B#M74A',
    name: 'Comfort Ergo 2-Lever Operator Chairs',
    price: '53.59',
    listPrice: '59.99',
  },
]

const ProductMatchItems = () => {
  return (
    <div className="product-match-items-wrapper grid grid-cols-1">
      <div className="product-match-caption w-full">Match it with</div>
      <div className="product-match-items-content w-full">
        <SliderComponent>
          {products.map((item, index) => (
            <Product
              key={index}
              stock={item.stock}
              rating={item.rating}
              total_count={item.count}
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
  )
}

const ProductDetailPage = ({ product, brand, labels }) => {
  return (
    <div className="product-detail-page-wrapper ">
      <div className="product-detail-page-content">
        <ProductDetailCategoryCaptionBar category={product.category} />
        <ProductContent product={product} brand={brand} labels={labels} />
        {product.productType === 'PARENT_VARIANT' && (
          <ProductVariants product={product} />
        )}
        <ProductDetailInfo product={product} />
        <ProductMatchItems />
      </div>
    </div>
  )
}
export default ProductDetailPage
