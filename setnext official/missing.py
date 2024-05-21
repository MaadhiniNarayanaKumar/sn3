from bs4 import BeautifulSoup
import re
import pandas as pd

from selenium import webdriver
options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

wd = webdriver.Chrome(options=options)
df_missing=pd.read_csv('missing.csv')
dflist=[]
for i in df_missing.Links:
    dflist.append(i)

def topic(url):
    import requests
    from bs4 import BeautifulSoup
    html_doc = requests.get(url)
    soup = BeautifulSoup(html_doc.text,'html.parser')
    return soup


r=0
desc=[]
name=[]
rating=[]
image=[]
price=[]
id=[]
for i in dflist:
    print(r)
    wd.get(i)
    html_content = wd.page_source
    soup = BeautifulSoup(html_content, 'html.parser')
    try:
        try:
                item_number = soup.find(id="productManufacturer").text
                item = re.findall(r'\d+', item_number)
                item_str = "".join(item)
                id.append(item_str)
        except:
                id.append('')

        #id
        try:
                des=soup.find(id="overview-section",class_="content-section").text.strip().replace("\n\n","").replace("   ","").replace("\n"," ")
        except AttributeError:
                des=""
        try:
                package_options=soup.find(class_="packagingOptions").text.strip().replace("\n\n\n\n","").replace("\n"," ").replace("/","").replace("   ","")
        except AttributeError:
                package_options=""
        try:
                det=soup.find(class_="pc-bg pc-bg-alt").text.strip().replace("\n\n\n","").replace("\n"," ").replace("   ","")
        except AttributeError:
                det=""

        joined = "".join([package_options,des,det])
        desc.append(joined)
        #desc
        try:
                name.append(soup.find(class_="pc-info-title").text.strip())
        except AttributeError:
                name.append(soup.find(class_="pageTitle").text.strip())
        #name        
        try:
                price.append(soup.find(class_="currentCost",attrs={'data-bind': 'text: costAfterAutoShip'}).text)
        except AttributeError as e:
                try:
                    price.append(soup.find(attrs={'data-bind': 'text: current'}).text)
                except AttributeError:
                    price.append(soup.find(attrs={'data-bind': 'text: cost'}).text)
        #price                
        link=soup.find(id="image-control").find("img").get("src")
        image.append("https:"+link)
        #image    
        try:
                rating.append(soup.find(itemprop="ratingValue").text)
        except AttributeError:
                rating.append('0')

        #rating  
    except:
        errorlist.append(i)

    #print(name[r])
    r=r+1

# print(len(products))
df_gift_for_riders_links = pd.DataFrame(list(zip(id,name,rating,price,desc,image,gift_for_riders_links,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
df_gift_for_riders_links.to_csv("Gift_For_Riders.csv", index = False)
