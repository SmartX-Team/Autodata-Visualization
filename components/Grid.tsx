import { Col, Row, Slider } from 'antd'
import { useState } from 'react'
import Image from 'next/image'

import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'
import React from 'react'

import { Popover } from 'antd'

const { Dragger } = Upload

const colCounts: Array<number> = [1, 2, 3, 4, 6, 8]

const Grid: React.FC = () => {
  const [colCountKey, setColCountKey] = useState(1)
  const [state, setState] = useState(0)

  const props: UploadProps = {
    name: 'file',
    multiple: true,

    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        setState(state + 1)
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const colCount = colCounts[colCountKey]

  return (
    <>
      <span>
        {colCount} X {colCount}
      </span>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Slider
          min={0}
          style={{
            width: '488px',
          }}
          max={Object.keys(colCounts).length - 1}
          value={colCountKey}
          onChange={setColCountKey}
          marks={colCounts.reduce((dict, value, index, array) => ({ ...dict, [index]: value }), {})}
          step={null}
          tooltip={{ formatter: value => value && colCounts[value] }}
        />
      </div>

      <Row
        style={{
          height: '100%',
        }}
      >
        {
          Array.from({ length: colCount }, (x, index) => index).map((row) =>
            Array.from({ length: colCount }, (x, index) => index).map((column) =>
              <Popover
                title={`Figure ${row * colCount + column}`}
                content={
                  <div>
                    <p>Name</p>
                    <p>Description</p>
                  </div>
                }
              >
                <Col
                  key={(row * colCount + column).toString()}
                  span={24 / colCount}
                  style={{
                    background: 'transparent',
                    border: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.5rem',
                      height: '100%',
                      borderRadius: '4px',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >

                    <Dragger
                      {...props}
                    >
                      {
                        colCount <= 4 &&
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                      }
                      {
                        colCount <= 3 &&
                        <p className="ant-upload-text">
                          Click or drag file to this area to upload
                        </p>
                      }
                      {
                        colCount > 3 &&
                        <p className="ant-upload-text" style={{ fontSize: '0.8rem', }}>
                          Drag & Drop
                        </p>
                      }
                      <Image
                        src={"http://127.0.0.1:9999/vM51oQZ6C6YcQkuYVYiT7EnJ7v9exVE4yHvaJMmTzoP/image/bafkreihhfurndt3cebsf2sur5tjnvvrnmc4exqmfxxcf3dt5ex6ccmxxjm/73882"}
                        alt="car"
                        layout="fill"
                        style={{
                          backgroundPosition: 'center',
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    </Dragger>
                  </div>
                </Col>
              </Popover >
            )
          )}
      </Row>
    </>
  )
}

export default Grid
