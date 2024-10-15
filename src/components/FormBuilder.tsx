'use client'
import React from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Radio,
  Button
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
const { Option } = Select

export type FormField = {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'date' | 'radio'
  rules: { required: boolean; message: string }[]
  options?: { value: string; label: string }[]
  fullWidth?: boolean
  order?: number
  defaultValue?: any
}

interface FormValues {
  [key: string]: any
}

const FormBuilder: React.FC<{
  fieldsData: FormField[][]
  onFinish: (values: FormValues[]) => void
}> = ({ fieldsData, onFinish }) => {
  const [form] = Form.useForm()

  const handleFinish = (values: FormValues) => {
    const formattedValues = fieldsData.map((fields, index) => {
      const passengerValues: FormValues = {}
      fields.forEach((field) => {
        passengerValues[field.name] = values[`${field.name}_${index}`]
      })
      return passengerValues
    })
    onFinish(formattedValues)
  }

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      scrollToFirstError={true}
    >
      {fieldsData.map((fields, passengerIndex) => (
        <div
          key={passengerIndex}
          style={{ marginBottom: '24px' }}
          className="shadow p-6"
        >
          <h3 className="text-base font-medium">
            Traveler {passengerIndex + 1}
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            {fields.map((field) => (
              <Form.Item
                key={`${field.name}_${passengerIndex}`}
                name={`${field.name}_${passengerIndex}`}
                label={field.label}
                rules={field.rules}
                initialValue={field.defaultValue}
                style={{
                  width: field.fullWidth ? '100%' : 'calc(50% - 8px)'
                }}
              >
                {(() => {
                  switch (field.type) {
                    case 'text':
                      return <Input placeholder={`Enter ${field.label}`} />
                    case 'number':
                      return (
                        <InputNumber
                          placeholder={`Enter ${field.label}`}
                          style={{ width: '100%' }}
                        />
                      )
                    case 'select':
                      return (
                        <Select
                          placeholder={`Select ${field.label}`}
                          style={{ width: '100%' }}
                        >
                          {field.options?.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      )
                    case 'date':
                      return (
                        <DatePicker
                          style={{ width: '100%' }}
                          placeholder={`Select ${field.label}`}
                          defaultValue={dayjs() as Dayjs}
                        />
                      )
                    case 'radio':
                      return (
                        <Radio.Group buttonStyle="solid">
                          {field.options?.map((option) => (
                            <Radio.Button
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </Radio.Button>
                          ))}
                        </Radio.Group>
                      )
                    default:
                      return null
                  }
                })()}
              </Form.Item>
            ))}
          </div>
        </div>
      ))}
      <Form.Item className="flex justify-center">
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          className="text-2xl font-semibold min-w-60"
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export { FormBuilder }
