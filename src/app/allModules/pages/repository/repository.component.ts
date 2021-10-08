import { SelectionModel } from '@angular/cdk/collections';
import { TreeControl,NestedTreeControl,FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTreeFlattener, MatTreeFlatDataSource, MatDialog, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'app/models/master';
import { BehaviorSubject,forkJoin, Observable ,of as ofObservable} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DocReturnData } from '../digital-signing/Model/returnfile.model';
import { DashboardService1 } from '../document-center/dashboard1.service';
import { DocHeaderDetail } from '../document-center/models/DashboardTable.model';
import { emailsender } from '../document-center/models/RemainderEmail.model';
import { sendRemainder } from '../document-center/models/SendRemainder.model';
import { DocTag } from '../new-doucument/models/Tag.model';
import { CreatedialogComponent } from './createdialog/createdialog.component';
import { TagService } from './service/tag.service';
export class TodoItemNode {
  children: TodoItemNode[] | any;
  item: string | any;
}
export class TodoItemFlatNode {
  item: string | any;
  level: number | any;
  expandable: boolean | any;
}
var TREE_DATA: any=[]
@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
  
})
export class RepositoryComponent implements OnInit {
  employeesDataSource: MatTableDataSource<any>;
  employeesDisplayColumns: string[] = ['title', 'author', 'date', 'fulfilment', 'signed', 'completeby', 'action'];
  DocId:any=[];
  AllRecords = [];
  DocList = [];
  dtag:any=[];
  viewClient: string = "";
  viewCompany: string = "";
  viewDocId: string = "";
  formdata: FormData;
  dtag1:any=[];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  InputMain:any;
  length:any=0;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  childrenlength:any=0;
  InitiatedRecords: DocHeaderDetail[] = [];
  NxtSignRecords: DocHeaderDetail[] = [];
  SignedRecords: DocHeaderDetail[] = [];
  Table_Data:any=[];
  Table_Data1:any=[];
  dataChange: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<TodoItemNode[]>([]);
  node: any;
  selecteddocId: any;
  hidespin1: boolean;
  get data(): TodoItemNode[] { return this.dataChange.value; }
  flatNodeMap: Map<TodoItemFlatNode, TodoItemNode> = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap: Map<TodoItemNode, TodoItemFlatNode> = new Map<TodoItemNode, TodoItemFlatNode>();
  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName: string = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  maskComponents: any[] = [];
  curruser:AuthenticationDetails ;
  displayname: string = "";
  constructor(public dialog: MatDialog,private _snackBar: MatSnackBar,private _tagservice:TagService,private service: DashboardService1,private router:Router) {
    this.curruser = JSON.parse(localStorage.getItem("authorizationData")); 
    this.displayname = this.curruser.DisplayName;
    const data = this.buildFileTree(TREE_DATA, 0);
    this.dataChange.next(data);
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    // this.data_disable=true
    this.dataChange.subscribe(data => {
      this.dataSource.data =data ;
      // this.data_disable=false
    });
   }
   buildFileTree(value:any,level:any)
   {
     let data: any[] = [];    
     for (let k in value) {
       let v = value[k];
       let node = new TodoItemNode();
       node.item = `${k}`;
       if (v === null || v === undefined) {
         // no action
       } else if (typeof v === 'object') {
         node.children = this.buildFileTree(v, level + 1);
       } else {
         node.item = v;
       }
       data.push(node);
     }    
     return data;
   }
   insertItem(parent: TodoItemNode, name: string) {
     const child = <TodoItemNode>{ item: name };
     if (parent.children) { 
       
       this.childrenlength=this.childrenlength+1;
       console.log("children",this.childrenlength)
       // parent already has children
       parent.children.push(child);
       this.dataChange.next(this.data );
     }
     else { // if parent is a leaf node
       parent.children = [];
       parent.children.push(child);
       this.dataChange.next(this.data);
     }
   }
 
   updateItem(node: TodoItemNode, name: string) {
     node.item = name;
     this.dataChange.next(this.data);
   }
   getLevel = (node: TodoItemFlatNode) => { return node.level; };
 
   isExpandable = (node: TodoItemFlatNode) => { return node.expandable; };
 
   getChildren = (node: TodoItemNode): Observable<TodoItemNode[]> => {
     return ofObservable(node.children);
   }
 
   hasChild = (_: number, _nodeData: TodoItemFlatNode) => { return _nodeData.expandable; };
 
   hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => { return _nodeData.item === ''; };
 
   /**
    * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
    */
   transformer = (node: TodoItemNode, level: number) => {
     let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.item === node.item
       ? this.nestedNodeMap.get(node)!
       : new TodoItemFlatNode();
     flatNode.item = node.item;
     flatNode.level = level;
     flatNode.expandable = !!node.children;
     this.flatNodeMap.set(flatNode, node);
     this.nestedNodeMap.set(node, flatNode);
     return flatNode;
   }
 
   /** Select the category so we can insert the new item. */
   addNewItem(node: TodoItemFlatNode) {
     const parentNode: any = this.flatNodeMap.get(node);
     // 
     let isParentHasChildren: boolean = false;
     if (parentNode.children)
       isParentHasChildren = true;
     //
     this.insertItem(parentNode!, '');
     // expand the subtree only if the parent has children (parent is not a leaf node)
     if (isParentHasChildren)
       this.treeControl.expand(node);
   console.log("datasrc"+this.dataSource);
   
   }
 
   /** Save the node to database */
   saveNode(node: TodoItemFlatNode, itemValue: string) {
     TREE_DATA=[];
     const nestedNode = this.flatNodeMap.get(node);
     this.updateItem(nestedNode!, itemValue);
   }
 
 
  ngOnInit() {
    this._tagservice.getTags().subscribe((g: DocTag) => {
      console.log(g[0].docId);
      this.dtag.push(g);
      for(let i=0;i<this.dtag[0].length;i++)
      {
        this.dtag1.push(this.dtag[0][i].tagName);
      }
      
      console.log(this.dtag1)
    })
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.getAllDashBoardData().subscribe((x: any) => {
      this.InitiatedRecords = x[0];
      this.NxtSignRecords = x[1];
      this.SignedRecords = x[2];
      const tableRecords = [];
      this.NxtSignRecords.forEach(g => {
        if (this.InitiatedRecords.indexOf(this.InitiatedRecords.find(k => k.docId == g.docId)) < 0) {
          tableRecords.push(g)
        }
      })

      this.SignedRecords.forEach(g => {
        if (this.InitiatedRecords.indexOf(this.InitiatedRecords.find(k => k.docId == g.docId)) < 0) {
          tableRecords.push(g)
        }
      })
      this.InitiatedRecords.forEach(g => {
        if (tableRecords.indexOf(g) < 0) {
          tableRecords.push(g);
        }
      })
      console.log(tableRecords);


      this.AllRecords = tableRecords.reverse();
      // this.hidespin = false;
      // this.employeesDataSource = new MatTableDataSource(this.AllRecords);
      this.DocList = tableRecords;
      console.log(this.DocList);
    })
   
  }
  getAllDashBoardData(): Observable<any> {
    return forkJoin([this.service.getInitiatedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getNxtSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getKPI(this.curruser.ClientID, this.curruser.Company), this.service.getProgress(this.curruser.ClientID, this.curruser.Company)]);
  }
  OpenMainDialog(): void {
    
    const dialogRef = this.dialog.open(CreatedialogComponent, {
      height: '52%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        // this.MainArray.push(res);
        // this.Mainlength = this.MainArray.length;
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.maskComponents.push(res);
        this.length=this.maskComponents.length;
        const data=this.buildFileTree(this.maskComponents,0);
        this.dataChange.next(data);
        // this.SubArray=data;
          this.dataSource.data = data;
      }
    });
  }
  logNode(node){
    console.log(node.item);
    this.node =node.item;
    this._tagservice.getTags().subscribe((g: DocTag) => {
      this.DocId=g;
      console.log(this.DocId);
      const Id =this.DocId.filter(x => { return x.tagName == node.item })
      console.log(Id[0].docId);
      // Id
     this.Table_Data =this.DocList.filter(x => { return x.docId == Id[0].docId });
       console.log(this.Table_Data);
       for(let i=0;i<this.Table_Data.length;i++){
        this.Table_Data1.push(this.Table_Data[i]);
        console.log(this.Table_Data1);
       }
      //  this.Table_Data1.push(this.Table_Data);
      //  console.log(this.Table_Data1);
       this.employeesDataSource = this.Table_Data;
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.dtag1.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  boolNxtsign(g: any) {
    // var a=this.NxtSignRecords;
    // console.log(a);
    if (g.client == this.curruser.ClientID) {
      if (this.NxtSignRecords.indexOf(this.NxtSignRecords.find(k => k.docId == g.docId)) >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }
  sign(client, company, docId, fulfilment, author, createdon, completeby) {
    // this.CreateActionLogvalues("Signing DocumentCenter Attachment");
    // client = x[0][0].client;
    // company = x[0][0].company;
    // docId = x[0][0].docId;
    console.log(client);
    localStorage.setItem("displayName", this.curruser.DisplayName);
    this.DocList.forEach(element => {
      if (element.docId === docId) {
        localStorage.setItem("DueDate", element.date);
      }
    })
    if (this.NxtSignRecords.find(f => f.docId == docId) != null) {
      localStorage.setItem("hideSign", "No")
    }

    localStorage.setItem("Author", author)
    localStorage.setItem("fulfilment", fulfilment);
    localStorage.setItem("CreatedOn", createdon);
    localStorage.removeItem('completeclient');
    localStorage.removeItem('completecompany');
    localStorage.removeItem('completedocId');
    localStorage.setItem("completedby", completeby)
    localStorage.setItem("Selectedclient", client);
    localStorage.setItem("Selectedcompany", company);
    localStorage.setItem("SelecteddocId", docId);
    this.router.navigate(['/pages/sign']);
  }
  view(client, company, docId, fulfilment) {
    // this.CreateActionLogvalues("View DocumentCenter Attachment");

    // client = x[0][0].client;
    // company = x[0][0].company;
    // docId = x[0][0].docId;
    console.log(client);
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    // this.router.navigate(['signDoc']);

    localStorage.setItem("viewClient", client);
    localStorage.setItem("fulfilmentSave", fulfilment)
    localStorage.setItem("viewCompany", company);
    localStorage.setItem("viewDocId", docId);
    localStorage.setItem("forUpdating", "Yes")
    this.router.navigate(['/pages/create']);

  }
  viewDoc(client, company, docId, fulfilment, author, createdon, completeby) {
    // this.CreateActionLogvalues("View DocumentCenter Attachment");
    localStorage.setItem("displayName", this.curruser.DisplayName);
    console.log(fulfilment);
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    let hideSignbutton = "";
    if (this.SignedRecords.find(f => f.docId == docId) != null) {
      localStorage.setItem("hideSign", "Yes")
    }
    if (this.InitiatedRecords.find(f => f.docId == docId) != null) {
      console.log("hidesss");

      localStorage.setItem("hideSign", "Yes")
    }
    this.DocList.forEach(element => {
      if (element.docId === docId) {
        localStorage.setItem("DueDate", element.date);
      }
    });
    localStorage.setItem("fulfilment", fulfilment);
    localStorage.setItem("Author", author)
    localStorage.setItem("CreatedOn", createdon)
    if (fulfilment !== "Completed") {
      console.log("here");


      localStorage.setItem("Selectedclient", client);
      localStorage.setItem("Selectedcompany", company);
      localStorage.setItem("SelecteddocId", docId);
    } else {

      localStorage.setItem("completedby", completeby)
      localStorage.setItem("completeclient", client);
      localStorage.setItem("completecompany", company);
      localStorage.setItem("completedocId", docId);
    }

    this.router.navigate(['/pages/sign']);
  }
  // sendRemainder(docId) {
  //   this.formdata = new FormData;
  //   this.service.sendRemainder(docId).subscribe((x) => {
  //     console.log(x);
  //     let obj1: sendRemainder = x;
  //     if (obj1.Type = "nxtsign") {
  //       console.log(x);
  //       var client = obj1.client;
  //       this.service.returnRemainder(client).subscribe((y: any) => {
  //         console.log(y);
  //         let obj2: emailsender = y;
  //         var userid = obj2.Username;
  //         var email = obj2.Email;

  //         // this.formdata = new FormData();
  //         this.formdata.append("DocID", userid);
  //         this.formdata.append("senderEmail", email);
  //         this.service.sendEmail(this.formdata).subscribe((z: any) => {
  //           console.log("formdata", z);

  //           this.snackbar.openSnackBar("Remainder sent successfully", SnackBarStatus.success, 2000);
  //         })
  //       })
  //     }



  //   })

  // }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array]);
    return blob;
  }
  sendRemainder(client, company, docId, fulfilment, author, createdon, completeby) {
    this.selecteddocId=docId;
    this.hidespin1 = true;
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    localStorage.setItem("viewClient", client);
    // localStorage.setItem("fulfilmentSave", fulfilment)
    localStorage.setItem("viewCompany", company);
    localStorage.setItem("viewDocId", docId);
    this.viewClient = localStorage.getItem("viewClient");
    this.viewCompany = localStorage.getItem("viewCompany");
    this.viewDocId = localStorage.getItem("viewDocId");
    this.formdata = new FormData;
    this.service.sendRemainder(docId).subscribe((x) => {
      console.log(x);
      let obj1: sendRemainder = x;
      // = "nxtsign"
      if (!obj1.Type) {
        console.log(x);
        this.service.getDocAtts(this.viewDocId, this.viewClient, this.viewCompany).subscribe((x: string[]) => {
          let Atts = x;
          this.service.getfilefromPostGres(x).subscribe((y: DocReturnData[]) => {
            y.forEach(q => {
              const blob = this.dataURItoBlob(q.files)
              const file = new File([blob], q.fileName, { 'type': q.fileType })
              console.log(file);


              var client = obj1.client;
              this.service.returnRemainder(client).subscribe((y: any) => {
                console.log(y);
                let obj2: emailsender = y;
                var userid = obj2.Username;
                var email = obj2.Email;

                this.formdata = new FormData();
                this.formdata.append("DocID", userid);
                this.formdata.append("senderEmail", email);
                this.formdata.append("File",file);
                // this.formdata.append("Files",)
                console.log(this.formdata.get("DocID"))
                this.service.sendEmail(this.formdata).subscribe((z: any) => {
                  console.log("formdata", z);
                  this.hidespin1 = false;
                  this._snackBar.open('Remainder sent successfully', '', {
                    duration: 2000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: 'i' === 'i' ? 'success' : 'info'
                  });
                  // this.snackbar.openSnackBar("Remainder sent successfully", SnackBarStatus.success, 2000);
                })
              })
            })
          })
        })
      }



    })

  }
  onSelect(selectedItem: DocHeaderDetail) {
    this.hidespin1 = true;
    console.log("Selected item Id: ", typeof selectedItem.docId); // You get the Id of the selected item here
    // let params = new HttpParams();
    // params = params.append("DocId", selectedItem.docId)

    // this.employeesDataSource = new MatTableDataSource(data);
    // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
    this.service.DeleteData(selectedItem.docId).subscribe(
      (data: any[]) => {
        console.log(data);
        const index: number = this.Table_Data.indexOf(selectedItem);
        if (index > -1) {
          this.Table_Data.splice(index, 1);
        }
        // this.signlength=data.filter(x => { return x.fulfilment == "Released" });
        // this.signlength1=this.signlength.length;
        // this.signcompletelength=data.filter(x => { return x.fulfilment == "Completed" });
        // this.signcompletelength1=this.signcompletelength.length;
        // this.signcompletelength2=data.filter(x => { return x.fulfilment == "In Signing" });
        // this.signcompletelength3=this.signcompletelength2.length;
        // if (selectedItem.fulfilment == "Released") {
        //   this.signlength1 = this.signlength1 - 1;
        // }
        // if (selectedItem.fulfilment == "Completed") {
        //   this.signcompletelength1 = this.signcompletelength1 - 1;
        // }
        // if (selectedItem.fulfilment == "In Signing") {
        //   this.signcompletelength3 = this.signcompletelength3 - 1;
        // }
        this.employeesDataSource = new MatTableDataSource(this.Table_Data);
        this.hidespin1 = false;
        // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
        this._snackBar.open('Deleted successfully', '', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          panelClass: 'i' === 'i' ? 'success' : 'info'
        });
      },
      (err) => {
        console.error(err);
      }
    )

  }




}
