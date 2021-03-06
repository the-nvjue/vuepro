import Vue from 'vue'
import {Button,Form,FormItem,Input,Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem,Breadcrumb,
BreadcrumbItem,Card,Col,Row,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option
,Cascader,Alert,Tabs,TabPane} from "element-ui";

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Container).use(Header).use(Aside).use(Main)
    .use(Menu).use(Submenu).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Col).use(Row)
    .use(Table).use(TableColumn).use(Switch).use(Tooltip).use(Pagination).use(Dialog).use(Tag).use(Tree)
    .use(Select).use(Option).use(Cascader).use(Alert).use(TabPane).use(Tabs);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;