import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AiOutlineClose,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from 'react-icons/ai'
import { CgNotes } from 'react-icons/cg'
import { useSelector } from 'react-redux'
import Badge from '@mui/material/Badge'
import AccountMenu from './accountmenu'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import LayoutContext from '../../pages/context'
import { LargePrimaryButton } from '../Utilities/button'
import { pageMenuSelector } from '../../redux/slices/pageReducer'
import {
  addTenantToUrl,
  homeUrl,
  loginUrl,
} from '../../services/service.config'

import { CurrencyBeforeValue } from 'components/Utilities/common'
import { useSites } from 'context/sites-provider'
import { useAuth } from 'context/auth-provider'
import { useLanguage } from '../../context/language-provider'
import { useQuotes } from 'context/quotes-context'
import { useContentful } from '../../context/contentful-provider'
import { useCart } from 'context/cart-provider'
import { useCurrency } from 'context/currency-context'

const Navbar = () => {
  const { userTenant: tenant } = useAuth()
  const { sites, onSiteChange, currentSite, currentSiteObject } = useSites()
  const { languages, currentLanguage, setLanguage } = useLanguage()
  const { user: currentUser } = useSelector((state) => state.auth)
  const { quotesTotal } = useQuotes()
  const [open, setOpen] = useState(false)

  const [displaySubItems, setDisplaySubItems] = useState(false)
  const [title, setTitle] = useState('')
  const [subMenuItems, setSubMenuItems] = useState([])

  const { setShowCart } = useContext(LayoutContext)
  const menuList = useSelector(pageMenuSelector)
  const navigate = useNavigate()
  const { currencyList, activeCurrency, updateCurrency } = useCurrency()
  const { cartAccount } = useCart()
  const currencyChangeHandler = async (value, site) => {
    updateCurrency(value, site)
  }

  const ParentBoard = () => {
    return (
      <>
        <div className="pt-12 items-center ">
          {currentUser ? (
            <div className="h-[75px] border-y w-full justify-between flex text-gray text-center items-center font-inter ">
              <div className="flex">
                <HiOutlineUserCircle size={25} />
                <div className="pl-2">{currentUser.username}</div>
              </div>
              <div>
                <AiOutlineMail size={20} />
              </div>
            </div>
          ) : (
            <div className="bg-tinBlue w-full h-12 text-sm  text-center items-center text-black">
              <Link to={loginUrl()}>
                <LargePrimaryButton className="" title="LOGIN | REGISTER" />
              </Link>
            </div>
          )}
        </div>
        <div className="w-full">
          <ul>
            {menuList.map((item, index) => (
              <ParentMenu key={index} item={item} />
            ))}
          </ul>
        </div>
        {currentUser && (
          <div className="w-full h-[59px] border-y flex justify-between items-center mt-6 font-inter text-base">
            Site
            <select className="text-tinBlue appearance-none">
              {sites
                .filter((s) => s.active)
                .sort((a, b) => a.code.localeCompare(b.code))
                .map((site) => {
                  return (
                    <option key={site.code} value={site.code}>
                      {site.name}
                    </option>
                  )
                })}
            </select>
          </div>
        )}
        <div className="w-full h-[59px] border-y flex justify-between items-center mt-6 font-inter text-base">
          Language
          <select className="text-tinBlue appearance-none">
            <option value="Engish">English</option>
            <option value="Italian">Italian</option>
            <option value="French">French</option>
          </select>
        </div>
        <div className="w-full h-[59px] border-y flex justify-between items-center">
          Currency
          <select
            value={activeCurrency.code !== undefined ? activeCurrency.code : ''}
            onChange={(e) =>
              currencyChangeHandler(e.target.value, currentSiteObject)
            }
            className="text-tinBlue appearance-none"
          >
            {currencyList.map((currency) => {
              return (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol}
                </option>
              )
            })}
          </select>
        </div>
      </>
    )
  }

  const ParentMenu = (props) => {
    const item = props.item
    return (
      <li
        key={item.title}
        className=" flex justify-between py-6 border-b last:border-b-0 text-2xl hover:text-slate-400"
        onClick={() => parentMenuClicked(item.title, item.items)}
      >
        {item.title}
        <ChevronRightIcon
          className={item.items.length ? 'h-8 w-8' : 'hidden'}
        />
      </li>
    )
  }

  const SubMenu = (props) => {
    const item = props.item
    return (
      <>
        {!item.items.length ? (
          <Link to={addTenantToUrl(item.url)}>
            <li
              key={item.title}
              className=" flex justify-between pb-4  text-base text-slate-400"
              onClick={() => parentMenuClicked(item.title, item.items)}
            >
              {item.title}
            </li>
          </Link>
        ) : (
          <li
            key={item.title}
            className=" flex justify-between pb-4  text-base text-slate-400"
            onClick={() => parentMenuClicked(item.title, item.items)}
          >
            {item.title}
            <ChevronRightIcon className={'h-8 w-8'} />
          </li>
        )}
      </>
    )
  }

  const SubBoard = () => {
    return (
      <>
        <div
          className="w-full flex text-center items-center border-b pt-[50px] pb-6 text-4"
          onClick={() => setDisplaySubItems(false)}
        >
          <ChevronLeftIcon className="h-8 w-8 pr-1" />
          Back
        </div>
        <div className="pt-6 text-left text-black text-xl">{title}</div>
        <div className="pt-12 px-6">
          <ul>
            {subMenuItems.map((item, index) => (
              <SubMenu key={index} item={item} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  const parentMenuClicked = (title, items) => {
    if (items.length) {
      setTitle(title)
      setDisplaySubItems(true)
      setSubMenuItems([...items])
    }
  }
  const handleOpenCart = () => {
    setShowCart(true)
  }

  const handleOpenQuotes = () => {
    navigate(`/${tenant}/my-account/my-quotes`)
  }
  // create a function for toggle mobile nav
  const handleNavOpen = () => {
    setOpen(!open)
  }
  const handleSiteChange = async (e) => {
    await onSiteChange(e.target.value)
    const site = sites.find((site) => site.code === e.target.value)
    await currencyChangeHandler(site.currency, site)
    navigate(homeUrl())
    navigate(0)
  }

  const [cartTotal, setCartTotal] = useState(0)
  const [cartTotalPrice, setCartTotalPrice] = useState(0)
  const [cartCurrency, setCartCurrency] = useState('-')
  const { fields } = useContentful()
  useEffect(() => {
    setCartTotal(cartAccount.items.length || 0)
    if (
      cartAccount &&
      cartAccount.subtotalAggregate &&
      cartAccount.subtotalAggregate.grossValue
    ) {
      setCartTotalPrice(cartAccount.subtotalAggregate.grossValue)
    } else {
      setCartTotalPrice(0)
    }
    if (cartAccount && cartAccount.currency) {
      setCartCurrency(cartAccount.currency)
    }
  }, [cartAccount])

  return (
    <header className="header bg-lightGray">
      {/* Dektop language and currency selection */}
      <div className="desktop_only_flex font-inter text-sm text-black">
        <div className='flex mr-40'>
            {sites
              .filter((s) => s.active)
              .sort((a, b) => a.code.localeCompare(b.code))
              .map((site, i, row) => {
                return (
                  <div>
                     <button className="font-bold" key={site.code} value={site.code} onClick={handleSiteChange}>
                      {site.name}
                    </button>

                    {i + 1 !== row.length ? (
                      <span className='ml-3 mr-3'>|</span>
                    ) : ''}
                  </div>
                )
              })}
        </div>
        {currentSite === 'HGG' ? (
          <div>
          {fields.languageLabel}:
          <select
            className=""
            onChange={(event) => setLanguage(event.target.value)}
            value={currentLanguage}
          >
            {languages 
              .sort((a, b) => a.localeCompare(b))
              .map((language) => {
                return (
                  <option key={language} value={language}>
                    {language}
                  </option>
                )
              })}
          </select>
        </div>
        ) : ''}
        
        <div className="ml-[22px]">
          {fields.currencyLabel}:
          <select
            value={activeCurrency.code !== undefined ? activeCurrency.code : ''}
            onChange={(e) =>
              currencyChangeHandler(e.target.value, currentSiteObject)
            }
            className=""
          >
            {currencyList.map((currency) => {
              return (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      {/* Dektop navigation selection */}
      <div className="desktop_only_flex font-inter font-normal text-sm text-black">
        {!currentUser ? (
          <ul className="flex">
            <li className="px-4 flex">
              {cartTotal !== 0 ? (
                <Badge badgeContent={cartTotal} color="error">
                  <AiOutlineShoppingCart size={20} onClick={handleOpenCart} />
                </Badge>
              ) : (
                <AiOutlineShoppingCart size={20} onClick={handleOpenCart} />
              )}
              <div className="pl-3 text-black flex">
                <CurrencyBeforeValue value={cartTotalPrice} />
              </div>
            </li>
            <li className="px-2">
              <a className="hover:text-emporixGold" href={`/${tenant}/login`}>
                Login
              </a>
            </li>
            |
            <li className="px-2">
              <a className="hover:text-emporixGold" href={`/${tenant}/signup`}>
                Sign Up
              </a>
            </li>
          </ul>
        ) : (
          <ul className="flex">
            <li className="px-4">
              <AiOutlineMail size={20} />
            </li>
            |
            <li className="px-4 pt-[2px]">
              {quotesTotal !== 0 ? (
                <Badge badgeContent={quotesTotal} color="error">
                  <CgNotes
                    size={16}
                    className="cursor-pointer"
                    onClick={handleOpenQuotes}
                  />
                </Badge>
              ) : (
                <CgNotes
                  size={16}
                  className="cursor-pointer"
                  onClick={handleOpenQuotes}
                />
              )}
            </li>
            |
            <li className="px-4 flex cursor-pointer" onClick={handleOpenCart}>
              {cartTotal !== 0 ? (
                <Badge badgeContent={cartTotal} color="warning">
                  <AiOutlineShoppingCart size={20} className="cursor-pointer" />
                </Badge>
              ) : (
                <AiOutlineShoppingCart size={20} />
              )}

              <div className="pl-[17.5px] text-black flex">
                <CurrencyBeforeValue
                  currency={cartCurrency}
                  value={cartTotalPrice}
                />
              </div>
            </li>
            |
            <li className="px-4 flex">
              <AccountMenu name={currentUser.username} />
            </li>
          </ul>
        )}
      </div>

      {/* mobile menu selection */}
      <div className="mobile_only_flex pl-[30.25px]  text-black cursor-pointer">
        {!open ? <AiOutlineMenu size={27.5} onClick={handleNavOpen} /> : null}
        {/* absolut mobile navigation */}
        <div
          className={
            !open
              ? 'hidden'
              : ' text-black absolute top-0 left-0 w-full  h-screen bg-white px-6 py-12  text-center font-medium overflow-y-auto'
          }
        >
          <div className="h-10 justify-between flex">
            <div className="flex">
              <Link to={loginUrl()} className="flex">
                <img src="/atom.png" className="w-[37px]"></img>
                <div className="px-4 text-[25px] font-medium items-center">
                  <span>{fields.companyNameLabel}</span>
                </div>
              </Link>
            </div>
            <div className="flex text-center pt-2" onClick={handleNavOpen}>
              <span className="pr-4">Close</span>
              <AiOutlineClose size={25} />
            </div>
          </div>
          {!displaySubItems ? <ParentBoard /> : <SubBoard />}
        </div>
      </div>

      <div className="mobile_only_flex text-black">
        <Link to={homeUrl()} className="flex">
          <img src="/atom.png"></img>
          <p className="font-medium text-xl px-3 pt-1">
            {fields.companyNameLabel}
          </p>
        </Link>
      </div>

      <div className="mobile_only text-black pr-[30px]">
        <AiOutlineSearch size={20} />
      </div>
    </header>
  )
}

export default Navbar
