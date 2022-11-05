import { message, Col, Popover, Row, Slider, Upload, UploadFile } from 'antd'
import { useState } from 'react'
import Image from 'next/image'

import { InboxOutlined } from '@ant-design/icons'
import React from 'react'

// Define static constants
const apiGateway: string = 'http://127.0.0.1:9999'
const maxGridSize: number = 8

// Define derived static constants
const availableGridSizes: Array<number> = Array.from({ length: maxGridSize }, (x, i) => i + 1);

// Define state types
interface VideoMetadata {
  account: string;
  videoName: string;
}
type VideoMetadataMatrix = { [index: number]: VideoMetadata }

// Define API callers
const loadImage = (account: string, imageHash: string, imageLength: number) =>
  `${apiGateway}/${account}/image/${imageHash}/${imageLength}`

const Grid: React.FC = () => {
  // Load states
  const videoMetadataMatrixInitialState: VideoMetadataMatrix = {}
  const [videoMetadataMatrix, setvideoMetadataMatrix] = useState(videoMetadataMatrixInitialState)
  const [colCountKey, setColCountKey] = useState(1)

  // Load and update the metadata
  const onChangeMetadata = (index: number, file: UploadFile<any>) => {
    const { status } = file
    let isSucceeded = null

    // Verbose
    if (status !== 'uploading') {
      console.log(file)
    }

    // Check uploading state
    if (status === 'done') {
      // Try to load metadata file

      isSucceeded = true
    }

    // Finalize
    if (isSucceeded === true) {
      setvideoMetadataMatrix({
        ...videoMetadataMatrix,
      })
      message.success(`Succeeded to load metadata: ${file.name}`)
    } else if (status === 'error' || isSucceeded === false) {
      message.error(`Failed to load metadata: ${file.name}`)
    }
  }

  // Remove the metadata
  const onRemoveMetadata = (index: number) => {
    if (index in videoMetadataMatrix) {
      delete videoMetadataMatrix[index]
      setvideoMetadataMatrix({
        ...videoMetadataMatrix,
      })
    }
  }

  const gridSize = availableGridSizes[colCountKey]

  return (
    <>
      <span>
        Matrix {gridSize} X {gridSize}
      </span>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Slider
          min={0}
          style={{
            width: '100%',
          }}
          max={Object.keys(availableGridSizes).length - 1}
          value={colCountKey}
          onChange={setColCountKey}
          marks={availableGridSizes.reduce((dict, value, index, array) => ({ ...dict, [index]: value }), {})}
          step={null}
          tooltip={{ formatter: value => value && availableGridSizes[value] }}
        />
      </div>

      <Row
        style={{
          height: '100%',
        }}
      >
        {
          Array.from({ length: gridSize }, (x, index) => index).map((column) =>
            <Col
              key={column}
              style={{
                background: 'transparent',
                border: 0,
                flex: 1,
              }}
            >
              {
                Array.from({ length: gridSize }, (x, index) => index).map((row) =>
                  <Popover
                    key={row * gridSize + column}
                    title={`Figure ${row * gridSize + column}`}
                    content={
                      <div>
                        <p>Name</p>
                        <p>Description</p>
                      </div>
                    }
                  >
                    <div
                      style={{
                        fontSize: '1.5rem',
                        borderRadius: '4px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: `${100 / gridSize}%`,
                        flex: 2,
                      }}
                    >
                      <Upload.Dragger
                        name='Metadata File (.video.json)'
                        multiple={false}
                        customRequest={(req) => { console.log(req) }}
                        onChange={(info) => onChangeMetadata(row * gridSize + column, info.file)}
                        onRemove={(_) => onRemoveMetadata(row * gridSize + column)}
                      >
                        {
                          gridSize <= 4 &&
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                        }
                        {
                          gridSize <= 3 &&
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                        }
                        {
                          gridSize > 3 &&
                          <p className="ant-upload-text" style={{ fontSize: '0.8rem', }}>
                            Drag & Drop
                          </p>
                        }
                        {
                          <Image
                            src={loadImage("vM51oQZ6C6YcQkuYVYiT7EnJ7v9exVE4yHvaJMmTzoP", "bafkreihhfurndt3cebsf2sur5tjnvvrnmc4exqmfxxcf3dt5ex6ccmxxjm", 73882)}
                            alt="car"
                            layout="fill"
                            style={{
                              backgroundPosition: 'center',
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                            }}
                          />
                        }
                      </Upload.Dragger>
                    </div>
                  </Popover >
                )
              }
            </Col>
          )
        }
      </Row>
    </>
  )
}

export default Grid
