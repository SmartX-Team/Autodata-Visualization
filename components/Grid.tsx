import { message, Col, Popover, Row, Slider, Upload, UploadFile } from 'antd'
import { useState } from 'react'
import Image from 'next/image'

import { InboxOutlined } from '@ant-design/icons'
import React from 'react'

// Define static constants
const apiGateway: string = 'http://127.0.0.1:9999'
const maxFrames: number = 7200
const maxGridSize: number = 8
const fps: number = 1.0
const skipFrames: number = 0

// Define derived static constants
const availableGridSizes: Array<number> = Array.from({ length: maxGridSize }, (x, i) => i + 1);

// Define state types
interface VideoMetadata {
  account: string;
  videoName: string;
}
type VideoMetadataMatrix = { [index: number]: VideoMetadata }

// Define API callers
const loadImage = (metadata: VideoMetadata | null, frameNumber: number) => {
  if (metadata == null) {
    return `https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png`
  }
  return `${apiGateway}/${metadata.account}/video/${metadata.videoName}/${frameNumber}/image`
}

// Define mapper functions
const gridIndex = (row: number, column: number) => {
  if (row == column) {
    return (row + 1) * (column + 1) - 1
  }
  else if (row > column) {
    return (row + 1) * row + column
  } else {
    return column * column + row
  }
}

const Grid: React.FC = () => {
  // Load states
  const videoMetadataMatrixInitialState: VideoMetadataMatrix = {}
  const [videoMetadataMatrix, setvideoMetadataMatrix] = useState(videoMetadataMatrixInitialState)
  const [colCountKey, setColCountKey] = useState(1)
  const [frameNumber, setframeNumber] = useState(1)

  // Define tick function
  setTimeout(() => setframeNumber((frameNumber + skipFrames + 1) % maxFrames), 1000.0 / fps)

  // Load and update the metadata
  const onChangeMetadata = (index: number, file: UploadFile<any>) => {
    const { status } = file

    // Check uploading state
    if (status === 'done') {
      try {
        // Try to parse metadata
        // TODO: implement it
        const metadata: VideoMetadata = file.response

        // Update metadata matrix
        videoMetadataMatrix[index] = metadata
        setvideoMetadataMatrix(videoMetadataMatrix)

        // Finished!
        message.success(`Succeeded to load metadata: ${file.name}`)
      }

      // Fail on errors
      catch {
        message.error(`Failed to load metadata: ${file.name}`)
      }
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
                    key={gridIndex(row, column)}
                    title={`Figure ${gridIndex(row, column)}`}
                    content={
                      gridIndex(row, column) in videoMetadataMatrix
                        ? <div>
                          <p>Account: {videoMetadataMatrix[gridIndex(row, column)].account}</p>
                          <p>Video: {videoMetadataMatrix[gridIndex(row, column)].videoName}</p>
                          <p>Current Frame: {frameNumber}</p>
                        </div>
                        : <div>
                          <p>Metadata not loaded</p>
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
                        customRequest={(req) => {
                          if (req.onSuccess != null) {
                            var reader = new FileReader()
                            reader.onload = (e) => {
                              req.onSuccess!(e.target?.result, undefined)
                            }
                            reader.readAsText(req.file as Blob)
                          }
                        }}
                        onChange={(info) => onChangeMetadata(gridIndex(row, column), info.file)}
                        onRemove={(_) => onRemoveMetadata(gridIndex(row, column))}
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
                            src={loadImage(videoMetadataMatrix[gridIndex(row, column)], frameNumber)}
                            alt=""
                            layout="fill"
                            priority={true}
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
