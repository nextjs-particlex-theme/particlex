import type { BlogService } from '@/api/svc/BlogService'
import BlogServiceImpl from '@/api/svc/impl/BlogServiceImpl'


type ServiceBeanFactoryObj = {
  blogService: BlogService
}

const ServiceBeans: ServiceBeanFactoryObj = {
  blogService: new BlogServiceImpl()
}


export default ServiceBeans
