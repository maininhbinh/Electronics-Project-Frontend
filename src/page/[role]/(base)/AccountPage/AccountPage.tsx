import Label from "../components/Label/Label";
import  { FC, useEffect, useState } from "react";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import { Form, Input, Upload} from 'antd'
import { Helmet } from "react-helmet-async";
import { avatarImgs } from "../../../../contains/fakeData";
import {Select as SelectAntd } from 'antd';
import type { SelectProps  } from 'antd';
import { useNavigate } from "react-router-dom";
import LoadingUser from "../../(manager)/user/util/Loading";
import ErrorLoad from "../../(manager)/components/util/ErrorLoad";
import { useGetProvincesQuery, useLazyGetDistrictsQuery } from "@/utils/addressRTKQuery";
import { popupError, popupSuccess } from "../../shared/Toast";
import { Iuser } from "@/common/types/user.interface";
import { useGetUserQuery, useUpdateUserMutation } from "../../(manager)/user/UsersEndpoints";

export interface AccountPageProps {
  className?: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }
  
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!'
    },
    number: {
      range: '${label} must be between ${min} and ${max}'
    },
    
  }
  const [file, setFile] = useState({
    data: {},
    loading: false
  })
  const handleUpload = async (options: any) => {
    const { onSuccess, file } = options
    setFile({
      data: file,
      loading: false
    })
    onSuccess('Upload successful', file)
 
  }
  const user = JSON.parse(String(localStorage.getItem('user')));
  const {data : dataItem, isLoading : dataLoading } = useGetUserQuery(user?.id);
 
  const [updateUser, { isLoading : loadingUpdateUser }] = useUpdateUserMutation();
  const [form] = Form.useForm();
  const [optionsDistrict, setOptionDistrict] = useState<SelectProps['options']>([])
  const [image, setImage] = useState("")

  useEffect(() => {
    if(dataItem?.data){
      localStorage.removeItem('user')
      localStorage.setItem('user', JSON.stringify(dataItem.data));
    }
  }, [dataItem])

  const onFileChanged = (event:any) => {
    debugger
    if (event?.file && event?.file.originFileObj) {
      setImage(URL.createObjectURL(event.file.originFileObj));
    }
  }
  
  const onFinish = async (values: Iuser | any) => {
    console.log(values);
    
    const formData = new FormData()
    for (const key  in values ) {
       if(String(key) == 'upload'){
        if( values[key]){
          formData.append('image',values[key][0].originFileObj);
        }
       
        continue;
       }
       if(String(key) == 'is_active'){
        if(values[key]){
           formData.append(key,'1')
        }else {
           formData.append(key,'0')
        }
        continue;
       }
       formData.append(key,values[key])
       
    }
    formData.append('is_virtual','0');
    try {
      const payload = {
        id : user.id,
        data : formData
      }
      await updateUser(payload).unwrap();
      popupSuccess('Update user success');
      handleCancel();
    } catch (error) {
      popupError('Update user error');
    }
    
  }

  const [getDistrict, { data : dataDistricts , isLoading : districtLoading}] = useLazyGetDistrictsQuery();




  useEffect(() => {
    setOptionDistrict(() => {
          return dataDistricts?.data.map((item : {id : number, name : string}) => {
               return {
                value : `${item.name}`,
                label : item.name
              }
           });
    })
 }, [dataDistricts])


  const options: SelectProps['options'] = [];
  

  const {
    data : provinces,
    isLoading,
    isError
  } = useGetProvincesQuery({});

  
   
  provinces?.data.forEach((item : {id : number, name : string}) => {
    options.push({
      value : `${item.name}-${item.id}`,
      label : item.name
     })
  });


  const onChangeProvince = async (value : string) => {
    form.resetFields(['district']);
    if(value){
      const splitStr = value.split(/-(\d+)/);
      const provinceId = splitStr[1];
      
      await getDistrict(provinceId);
     
      
    }else {
       setOptionDistrict([]);
    }
    

}
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('..')
  }

  if(isLoading || dataLoading) return <LoadingUser />
  if(isError) return <ErrorLoad />
  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>Account || Ciseco ecommerce React Template</title>
      </Helmet>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Account infomation
          </h2>
          <Form
            initialValues={dataItem?.data}
            form={form}
            {...layout}
            name='nest-messages'
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
            validateMessages={validateMessages}
          >
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex items-start">
              {/* AVATAR */}
              <div className="relative rounded-full overflow-hidden flex">
                <img
                  src={!image ? dataItem?.data.image : image}
                  alt=""
                  className="w-32 h-32 rounded-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <Form.Item
                  name='upload'
                  label='.'
                  valuePropName='fileList'
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                >
                  <Upload name='image' listType='picture' showUploadList={false} onChange={onFileChanged} customRequest={handleUpload}>
                    <span className="mt-1 text-xs text-white">Change Image</span>
                  </Upload>
                </Form.Item>
                </div>
                
              </div>
            </div>
            <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
              <div>
                <Label>User name</Label>
                <Form.Item name="username" rules={[{required: true }]}>
                  <Input name="username" className="mt-1.5 !rounded-l-none w-[445px]" defaultValue="Enrico Cole" />
                </Form.Item>
              </div>

              {/* ---- */}

              {/* ---- */}
              <div>
                <Label>Email</Label>
                <div className="mt-1.5 flex">
                  <span className="h-[40px] inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-envelope"></i>
                  </span>
                  <Form.Item name="email">
                    <Input
                      name="email"
                      className="!rounded-l-none w-[400px]"
                      placeholder="example@email.com"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* ---- */}
              {/* <div className="max-w-lg">
                <Label>Date of birth</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-calendar"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    type="date"
                    defaultValue="1990-07-22"
                  />
                </div>
              </div> */}
              {/* ---- */}
              <div>
                <Label>Addess</Label>
                <div className="mt-1.5 flex">
                  <span className="h-[40px] inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-map-signs"></i>
                  </span>
                  <Form.Item name="address">
                    <Input
                      name="address"
                      className="!rounded-l-none w-[400px]"
                      defaultValue="New york, USA"
                    />
                  </Form.Item>
                </div>
              </div>

              <div>
                <Label>County</Label>
                <Form.Item name="county" rules={[{required: true }]}>
                  <SelectAntd
                
                      style={{ width: '445px', height:'40px'}}
                    
                      options={[
                    
                        { value: 'Việt Nam', label: 'VietNam' },
                      
                      ]}
                    />
                </Form.Item>
              </div>         

              <div>
                <Label>City</Label>
                <Form.Item name="city" rules={[{required: true }]}>
                  <SelectAntd
                      
                      style={{ width: '445px', height:'40px'}}
                      placeholder="Enter name province"
                      options={options}
                      onChange={(value) => onChangeProvince(value)}
                    />
                </Form.Item>
              </div>

              <div>
                <Label>District</Label>
                <Form.Item name="district" rules={[{required: true }]}>
                      <SelectAntd
                          loading={districtLoading}                      
                          style={{ width: '445px', height:'40px'}}
                          placeholder="Enter name district"
                          options={optionsDistrict}
                        />
                </Form.Item>
              </div>

              {/* ---- */}
              {/* <div>
                <Label>Gender</Label>
                <Select className="mt-1.5">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </div> */}

              {/* ---- */}
              <div>
                <Label>Phone number</Label>
                <div className="mt-1.5 flex">
                  <span className="h-[40px] inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-xl las la-phone-volume"></i>
                  </span>
                  <Form.Item name="phone" rules={[{required: true }]}>
                    <Input
                      name="phone"
                      className="!rounded-l-none w-[400px]"
                      defaultValue="003 888 232"
                    />
                  </Form.Item>
                </div>
              </div>
              {/* ---- */}
              {/* <div>
                <Label>About you</Label>
                <Textarea className="mt-1.5" defaultValue="..." />
              </div> */}
              <div className="pt-2">
                <Form.Item className='mt-3' wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <ButtonPrimary loading={loadingUpdateUser || file.loading} disabled={loadingUpdateUser || file.loading}>
                    Update account
                  </ButtonPrimary>
                </Form.Item>
              </div>
            </div>
          </div>
          </Form>
        </div>
    </div>
  );
};

export default AccountPage;
