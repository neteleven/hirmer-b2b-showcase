import React from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Status, { renderStatus } from './common'
import {
  CurrencyAfterValue,
  formatDateTime,
} from '../../components/Utilities/common'
import { Link } from 'react-router-dom'
import {
  myAccountMyOrdersInvoiceUrl,
  myAccountMyOrdersViewUrl,
} from '../../services/service.config'

const OrderListMobile = ({ orders }) => {
  return (
    <>
      {orders.map((row) => (
        <div key={row.id} className="py-6 border-t border-lightGray">
          <div className="flex justify-between">
            <Status
              width={108}
              height={24}
              title={row.status}
              color={row.status === 'SHIPPED' ? '#FFA800' : '#4BCB67'}
            />
            <div className="flex">
              <div className="font-inter font-semibold text-[14px] underline">
                <Link to={`${myAccountMyOrdersViewUrl()}${row.id}`}>View</Link>
              </div>
              <div className="font-inter font-semibold text-[14px] underline ml-6">
                <Link to={`${myAccountMyOrdersInvoiceUrl()}${row.id}`}>
                  Invoice
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-2 font-bold">{row.id}</div>
          <div className="font-inter pt-2">
            <CurrencyAfterValue value={row.totalPrice} />
          </div>
          <div className="pt-2">{row.created}</div>
        </div>
      ))}
    </>
  )
}

export const OrderList = (props) => {
  const { orders, invoiceAvailable } = props

  return (
    <div className="md:mt-[60px]">
      <TableContainer className="desktop_only">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="!py-6">
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Order Number
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Status
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Total
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Created
              </TableCell>
              <TableCell align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  {row.id}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {renderStatus(row.status)}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <CurrencyAfterValue
                    value={row.totalPrice}
                    currency={row.currency}
                  />
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {formatDateTime(row.created)}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <div className="flex">
                    <div className="font-inter font-semibold text-[14px] underline">
                      <Link to={`${myAccountMyOrdersViewUrl()}${row.id}`}>
                        View
                      </Link>
                    </div>
                    {invoiceAvailable && (
                      <div className="font-inter font-semibold text-[14px] underline ml-6">
                        <Link to={`${myAccountMyOrdersInvoiceUrl()}${row.id}`}>
                          Invoice
                        </Link>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mobile_only">
        <OrderListMobile orders={orders} />
      </div>
    </div>
  )
}
