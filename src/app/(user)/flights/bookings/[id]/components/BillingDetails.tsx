'use client'
import { Offer } from '@duffel/api/types'
import { formatCurrency } from '@/utils/formatCurrency'
import { Tooltip, Modal } from 'antd'
import { FaInfoCircle } from 'react-icons/fa'
import moment from 'moment'
import { useTimer } from 'react-timer-hook'
import Link from 'next/link'
import { CiSearch, CiWarning } from 'react-icons/ci'
import { FaArrowRightLong } from 'react-icons/fa6'

export const BillingDetails = ({ offer }: { offer: Offer }) => {
  const { seconds, minutes, isRunning } = useTimer({
    expiryTimestamp: new Date(offer.expires_at),
    onExpire: () => {
      Modal.warn({
        title: null,
        icon: null,
        content: (
          <div className="flex flex-col items-center justify-center py-12">
            <CiWarning className="text-red-500 text-6xl mb-2" />
            <p className="text-xl text-neutral-600 font-semibold">
              Session has expired
            </p>
            <p className="text-ms px-12 mt-2 text-neutral-500 text-center">
              This offer can&apos; be avail at this moment. Please go back to
              home page and search for another offer.
            </p>
            <Link
              href="/"
              className="mt-6 gap-2 text-xl relative flex items-center justify-center px-8 py-2 rounded-full  transition-all duration-200 focus:outline-none"
            >
              Return home <FaArrowRightLong />
            </Link>
          </div>
        ),
        footer: null,

        closable: false
      })
    }
  })

  return (
    <div className="min-w-96 mx-auto sticky top-4 space-y-4">
      <div className="rounded-md shadow p-4 transition-shadow overflow-hidden">
        <h3 className="font-semibold text-neutral-700 pb-4 flex items-center justify-center text-center mx-[-1rem] px-4 border-b border-b-neutral-100">
          Session ends at &nbsp;
          <Tooltip
            placement="bottom"
            title="After this time the offer will expire and no longer be usable to create an order"
          >
            <FaInfoCircle className="text-neutral-400 text-sm" />
          </Tooltip>
        </h3>
        <div className="mt-4">
          <h3 className="font-semibold text-2xl text-neutral-700 text-center mx-[-1rem] px-4">
            {isRunning ? (
              <div>
                {minutes} : {seconds}
              </div>
            ) : (
              <div className="text-red-500 text-base">
                <div className="flex items-center gap-1 justify-center">
                  <CiWarning /> Offer expired on <br />
                </div>
                <div className="text-neutral-500 text-xs font-light">
                  {moment(offer.expires_at).toString()}
                </div>
                <div className="text-neutral-500 gap-3 font-normal text-sm my-8 flex flex-col items-center justify-center">
                  <CiSearch className="text-3xl" />
                  <div>
                    Please{' '}
                    <Link href="/" className="text-blue-600">
                      search again
                    </Link>{' '}
                    to get latest offers.
                  </div>
                </div>
              </div>
            )}
          </h3>
        </div>
      </div>
      <div className="rounded-md shadow p-4 transition-shadow overflow-hidden">
        <h3 className="font-semibold text-neutral-700 pb-4 text-center mx-[-1rem] px-4 border-b border-b-neutral-100">
          Payment details
        </h3>

        <div className="mt-4">
          <div className="font-medium text-sm inline-block border-b">
            Billing Details
          </div>
          <div className="space-y-1 pb-4 pt-2">
            <div className="text-neutral-500 text-sm flex items-center justify-between">
              <div>Base Amount</div>
              <div>
                {formatCurrency(+offer.base_amount, offer.base_currency)}
              </div>
            </div>
            {offer.tax_amount && (
              <div className="text-neutral-500 text-sm flex items-center justify-between">
                <div>Tax Amount</div>
                <div>
                  {formatCurrency(+offer.tax_amount, offer.base_currency)}
                </div>
              </div>
            )}
          </div>
          <div className="text-neutral-600 font-semibold py-1 mb-[-1rem] pb-4 mx-[-1rem] px-4 bg-primary-50 flex items-center justify-between">
            <div>Total</div>
            <div>
              {formatCurrency(+offer.total_amount, offer.total_currency)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingDetails
