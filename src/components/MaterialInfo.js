import useStore from '@/helpers/store/materials'
import { licenses } from '@/helpers/constants/licenses'
import { getMaterialSize } from '@/helpers/getMaterialSize'
import { useState } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
const ModelInfo = (material) => {
  const [tab, setTab] = useState('r3f')
  const { createZip, createCodeDownload } = useStore((state) => ({
    createZip: state.createZip,
    createCodeDownload: state.createCodeDownload,
  }))

  const tabs = [
    {
      name: 'React Three Fiber',
      onClick: () => setTab('r3f'),
      current: tab === 'r3f',
    },
    {
      name: 'Three.js',
      onClick: () => setTab('three'),
      current: tab === 'three',
    },
  ]
  return (
    <div className='mt-5'>
      <div className='block mb-5 overflow-hidden bg-gray-100 rounded group w-80'>
        <img
          src={material.image}
          alt={material.info.name}
          className='object-cover pointer-events-none'
        />
      </div>
      <aside className='relative'>
        <span className='text-gray-600'>Created by: </span>
        <a
          target='_blank'
          href={material.info.creatorLink}
          rel='noreferrer'
          className='font-bold'
        >
          {material.info.creator}
        </a>
        <span className='block'>
          <span className='text-gray-600'>License: </span>{' '}
          {licenses[material.info.license] ? (
            <a
              target='_blank'
              href={licenses[material.info.license].link}
              rel='noreferrer'
              className='font-bold'
            >
              {licenses[material.info.license].name}
            </a>
          ) : (
            <span className='font-bold'>{material.info.license}</span>
          )}
        </span>
        <span className='flex items-center'>
          <span className='pr-2 text-gray-600 '>Size: </span>{' '}
          <span className='inline-flex font-bold'>
            <span>{getMaterialSize(material)}</span>
          </span>
        </span>
        {material.info.category && (
          <>
            <span className='text-gray-600'>Category: </span>
            <span className='inline-flex items-center px-2 mt-1 text-xs font-medium text-gray-800 bg-gray-100 rounded py-0.5'>
              {material.info.category}
            </span>
          </>
        )}
        <div className='my-4'>
          {material.info.category === 'matcaps' && (
            <div>
              <div className='sm:hidden'>
                <label htmlFor='tabs' className='sr-only'>
                  Select a tab
                </label>
                <select
                  id='tabs'
                  name='tabs'
                  className='block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                  defaultValue={tabs.find((tab) => tab.current).name}
                >
                  {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                </select>
              </div>
              <div className='hidden sm:block'>
                <div className='border-b border-gray-200'>
                  <nav className='flex -mb-px space-x-8' aria-label='Tabs'>
                    {tabs.map((tab) => (
                      <button
                        key={tab.name}
                        onClick={tab.onClick}
                        className={classNames(
                          tab.current
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        )}
                        aria-current={tab.current ? 'page' : undefined}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
          {tab === 'r3f' && (
            <a
              className='block w-full py-2 mt-3 text-center text-white bg-gray-800 cursor-pointer'
              download
              onClick={() => createCodeDownload(material)}
            >
              Download starter project
            </a>
          )}
        </div>
        {material.info.category === 'matcaps' ? (
          <a
            className='block w-full py-2 text-center text-white bg-gray-800'
            download
            href={material.url}
          >
            Download Matcap
          </a>
        ) : (
          <button
            className='block w-full py-2 text-center text-white bg-gray-800'
            onClick={() => createZip(material)}
          >
            Download Textures
          </button>
        )}
      </aside>
    </div>
  )
}

export default ModelInfo
