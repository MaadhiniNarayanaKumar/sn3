from bs4 import BeautifulSoup
import re
import pandas as pd

from selenium import webdriver
options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

wd = webdriver.Chrome(options=options)


all=["https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%221420%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D","https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%221429%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D","https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%22437%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D","https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%222173%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D","https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%22645%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D","https://www.smartpakequine.com/pt/gift-certificate-2830","https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%221714%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D","https://www.smartpakequine.com/treats-and-toys-for-horses--gifts-2026pc"]
products=[]

j=0
errorlist=[]



def topic(url):
    import requests
    from bs4 import BeautifulSoup
    html_doc = requests.get(url)
    soup = BeautifulSoup(html_doc.text,'html.parser')
    return soup


# gift_for_riders_links = []
# j = topic("https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%221420%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D")
# # print(j)
# for i in j.find_all(class_='product'):
#   gift_for_riders_links.append("https://www.smartpakequine.com/"+i.find('a').get('href'))

# gift_for_horses_links = []
# j = topic("https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%221429%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D")
# # print(j)
# for i in j.find_all(class_='product'):
#   gift_for_horses_links.append("https://www.smartpakequine.com/"+i.find('a').get('href'))

# gift_for_kids_links = []
# j = topic("https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%22437%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D")
# # print(j)
# for i in j.find_all(class_='product'):
#   gift_for_kids_links.append("https://www.smartpakequine.com/"+i.find('a').get('href'))

# gift_for_horses_trainers_links = []
# j = topic("https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%222173%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D")
# # print(j)
# for i in j.find_all(class_='product'):
#   gift_for_horses_trainers_links.append("https://www.smartpakequine.com/"+i.find('a').get('href'))
#   #gift_for_riders_links

# personalised_horse_gifts_links = []
# j = topic("https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%22645%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D")
# # print(j)
# for i in j.find_all(class_='product'):
#   personalised_horse_gifts_links.append("https://www.smartpakequine.com/"+i.find('a').get('href'))
#   #gift_for_riders_links

# gift_cretificates = ["https://www.smartpakequine.com/pt/gift-certificate-2830"]

gift_for_dogs_links = []
j = topic("https://www.smartpakequine.com/search/SearchByParameter?parameters=%7B%22Query%22%3A%221714%22%2C%22Type%22%3A%22category%22%2C%22Start%22%3A0%2C%22Size%22%3A200%2C%22Sort%22%3A1%2C%22Facets%22%3A%5B%5D%7D")
# print(j)
for i in j.find_all(class_='product'):
  gift_for_dogs_links.append("https://www.smartpakequine.com/"+i.find('a').get('href'))
  #gift_for_riders_links

Treats_Toys_for_Horses_Gifts = []
j = topic("https://www.smartpakequine.com/treats-and-toys-for-horses--gifts-2026pc")
# print(j)
for i in j.find_all(class_='product'):
  Treats_Toys_for_Horses_Gifts.append("https://www.smartpakequine.com/"+i.find('a').get('href'))
  #gift_for_riders_links





# r=0
# desc=[]
# name=[]
# rating=[]
# image=[]
# price=[]
# id=[]
# brand=[]
# for i in gift_for_riders_links:
#     print(r)
#     wd.get(i)
#     html_content = wd.page_source
#     soup = BeautifulSoup(html_content, 'html.parser')
#     try:
#         try:
#                 item_number = soup.find(id="productManufacturer").text
#                 item = re.findall(r'\d+', item_number)
#                 item_str = "".join(item)
#                 id.append(item_str)
#         except:
#                 id.append('')

#         #id
#         try:
#                 item_number = soup.find(id="productManufacturer").find('a').text
#                 # item = re.findall(r'\d+', item_number)
#                 # item_str = "".join(item)
#                 brand.append(item_number)
#         except:
#                 brand.append('')

#         #brand
#         try:
#                 des=soup.find(id="overview-section",class_="content-section").text.strip().replace("\n\n","").replace("   ","").replace("\n"," ")
#         except AttributeError:
#                 des=""
#         try:
#                 package_options=soup.find(class_="packagingOptions").text.strip().replace("\n\n\n\n","").replace("\n"," ").replace("/","").replace("   ","")
#         except AttributeError:
#                 package_options=""
#         try:
#                 det=soup.find(class_="pc-bg pc-bg-alt").text.strip().replace("\n\n\n","").replace("\n"," ").replace("   ","")
#         except AttributeError:
#                 det=""

#         joined = "".join([package_options,des,det])
#         desc.append(joined)
#         #desc
#         try:
#                 name.append(soup.find(class_="pc-info-title").text.strip())
#         except AttributeError:
#                 name.append(soup.find(class_="pageTitle").text.strip())
#         #name        
#         try:
#                 price.append(soup.find(class_="currentCost",attrs={'data-bind': 'text: costAfterAutoShip'}).text)
#         except AttributeError as e:
#                 try:
#                     price.append(soup.find(attrs={'data-bind': 'text: current'}).text)
#                 except AttributeError:
#                     price.append(soup.find(attrs={'data-bind': 'text: cost'}).text)
#         #price                
#         link=soup.find(id="image-control").find("img").get("src")
#         image.append("https:"+link)
#         #image    
#         try:
#                 rating.append(soup.find(itemprop="ratingValue").text)
#         except AttributeError:
#                 rating.append('0')

#         #rating  
#     except:
#         errorlist.append(i)

#     #print(name[r])
#     r=r+1

# # print(len(products))
# df_gift_for_riders_links = pd.DataFrame(list(zip(id,name,rating,price,desc,image,gift_for_riders_links,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
# df_gift_for_riders_links.to_csv("Gift_For_Riders.csv", index = False)

# r=0
# desc=[]
# name=[]
# rating=[]
# image=[]
# price=[]
# id=[]
# brand=[]
# for i in gift_for_horses_links:
#     print(r)
#     wd.get(i)
#     html_content = wd.page_source
#     soup = BeautifulSoup(html_content, 'html.parser')
#     try:
#         try:
#                 item_number = soup.find(id="productManufacturer").text
#                 item = re.findall(r'\d+', item_number)
#                 item_str = "".join(item)
#                 id.append(item_str)
#         except:
#                 id.append('')

#         #id
#         try:
#                 item_number = soup.find(id="productManufacturer").find('a').text
#                 # item = re.findall(r'\d+', item_number)
#                 # item_str = "".join(item)
#                 brand.append(item_number)
#         except:
#                 brand.append('')

#         #brand
#         try:
#                 des=soup.find(id="overview-section",class_="content-section").text.strip().replace("\n\n","").replace("   ","").replace("\n"," ")
#         except AttributeError:
#                 des=""
#         try:
#                 package_options=soup.find(class_="packagingOptions").text.strip().replace("\n\n\n\n","").replace("\n"," ").replace("/","").replace("   ","")
#         except AttributeError:
#                 package_options=""
#         try:
#                 det=soup.find(class_="pc-bg pc-bg-alt").text.strip().replace("\n\n\n","").replace("\n"," ").replace("   ","")
#         except AttributeError:
#                 det=""

#         joined = "".join([package_options,des,det])
#         desc.append(joined)
#         #desc
#         try:
#                 name.append(soup.find(class_="pc-info-title").text.strip())
#         except AttributeError:
#                 name.append(soup.find(class_="pageTitle").text.strip())
#         #name        
#         try:
#                 price.append(soup.find(class_="currentCost",attrs={'data-bind': 'text: costAfterAutoShip'}).text)
#         except AttributeError as e:
#                 try:
#                     price.append(soup.find(attrs={'data-bind': 'text: current'}).text)
#                 except AttributeError:
#                     price.append(soup.find(attrs={'data-bind': 'text: cost'}).text)
#         #price                
#         link=soup.find(id="image-control").find("img").get("src")
#         image.append("https:"+link)
#         #image    
#         try:
#                 rating.append(soup.find(itemprop="ratingValue").text)
#         except AttributeError:
#                 rating.append('0')

#         #rating  
#     except:
#         errorlist.append(i)

#     #print(name[r])
#     r=r+1

# # print(len(products))
# df_gift_for_horses_links = pd.DataFrame(list(zip(id,name,rating,price,desc,image,gift_for_horses_links,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
# df_gift_for_horses_links.to_csv("Gift_For_Horses.csv", index = False)

# r=0
# desc=[]
# name=[]
# rating=[]
# image=[]
# price=[]
# id=[]
# brand=[]
# for i in gift_for_kids_links:
#     print(r)
#     wd.get(i)
#     html_content = wd.page_source
#     soup = BeautifulSoup(html_content, 'html.parser')
#     try:
#         try:
#                 item_number = soup.find(id="productManufacturer").text
#                 item = re.findall(r'\d+', item_number)
#                 item_str = "".join(item)
#                 id.append(item_str)
#         except:
#                 id.append('')

#         #id
#         try:
#                 item_number = soup.find(id="productManufacturer").find('a').text
#                 # item = re.findall(r'\d+', item_number)
#                 # item_str = "".join(item)
#                 brand.append(item_number)
#         except:
#                 brand.append('')

#         #brand
#         try:
#                 des=soup.find(id="overview-section",class_="content-section").text.strip().replace("\n\n","").replace("   ","").replace("\n"," ")
#         except AttributeError:
#                 des=""
#         try:
#                 package_options=soup.find(class_="packagingOptions").text.strip().replace("\n\n\n\n","").replace("\n"," ").replace("/","").replace("   ","")
#         except AttributeError:
#                 package_options=""
#         try:
#                 det=soup.find(class_="pc-bg pc-bg-alt").text.strip().replace("\n\n\n","").replace("\n"," ").replace("   ","")
#         except AttributeError:
#                 det=""

#         joined = "".join([package_options,des,det])
#         desc.append(joined)
#         #desc
#         try:
#                 name.append(soup.find(class_="pc-info-title").text.strip())
#         except AttributeError:
#                 name.append(soup.find(class_="pageTitle").text.strip())
#         #name        
#         try:
#                 price.append(soup.find(class_="currentCost",attrs={'data-bind': 'text: costAfterAutoShip'}).text)
#         except AttributeError as e:
#                 try:
#                     price.append(soup.find(attrs={'data-bind': 'text: current'}).text)
#                 except AttributeError:
#                     price.append(soup.find(attrs={'data-bind': 'text: cost'}).text)
#         #price                
#         link=soup.find(id="image-control").find("img").get("src")
#         image.append("https:"+link)
#         #image    
#         try:
#                 rating.append(soup.find(itemprop="ratingValue").text)
#         except AttributeError:
#                 rating.append('0')

#         #rating  
#     except:
#         errorlist.append(i)

#     # print(name[r])
#     r=r+1

# # print(len(products))
# df_gift_for_kids_links = pd.DataFrame(list(zip(id,name,rating,price,desc,image,gift_for_kids_links,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
# df_gift_for_kids_links.to_csv("Gift_For_Kids.csv", index = False)


# r=0
# desc=[]
# name=[]
# rating=[]
# image=[]
# price=[]
# id=[]
# brand=[]
# for i in gift_for_horses_trainers_links:
#     print(r)
#     wd.get(i)
#     html_content = wd.page_source
#     soup = BeautifulSoup(html_content, 'html.parser')
#     try:
#         try:
#                 item_number = soup.find(id="productManufacturer").text
#                 item = re.findall(r'\d+', item_number)
#                 item_str = "".join(item)
#                 id.append(item_str)
#         except:
#                 id.append('')

#         #id
#         try:
#                 item_number = soup.find(id="productManufacturer").find('a').text
#                 # item = re.findall(r'\d+', item_number)
#                 # item_str = "".join(item)
#                 brand.append(item_number)
#         except:
#                 brand.append('')

#         #brand
#         try:
#                 des=soup.find(id="overview-section",class_="content-section").text.strip().replace("\n\n","").replace("   ","").replace("\n"," ")
#         except AttributeError:
#                 des=""
#         try:
#                 package_options=soup.find(class_="packagingOptions").text.strip().replace("\n\n\n\n","").replace("\n"," ").replace("/","").replace("   ","")
#         except AttributeError:
#                 package_options=""
#         try:
#                 det=soup.find(class_="pc-bg pc-bg-alt").text.strip().replace("\n\n\n","").replace("\n"," ").replace("   ","")
#         except AttributeError:
#                 det=""

#         joined = "".join([package_options,des,det])
#         desc.append(joined)
#         #desc
#         try:
#                 name.append(soup.find(class_="pc-info-title").text.strip())
#         except AttributeError:
#                 name.append(soup.find(class_="pageTitle").text.strip())
#         #name        
#         try:
#                 price.append(soup.find(class_="currentCost",attrs={'data-bind': 'text: costAfterAutoShip'}).text)
#         except AttributeError as e:
#                 try:
#                     price.append(soup.find(attrs={'data-bind': 'text: current'}).text)
#                 except AttributeError:
#                     price.append(soup.find(attrs={'data-bind': 'text: cost'}).text)
#         #price                
#         link=soup.find(id="image-control").find("img").get("src")
#         image.append("https:"+link)
#         #image    
#         try:
#                 rating.append(soup.find(itemprop="ratingValue").text)
#         except AttributeError:
#                 rating.append('0')

#         #rating  
#     except:
#         errorlist.append(i)

#     # print(name[r])
#     r=r+1

# # print(len(products))
# df_gift_for_horses_trainers_links = pd.DataFrame(list(zip(id,name,rating,price,desc,image,gift_for_horses_trainers_links,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
# df_gift_for_horses_trainers_links.to_csv("Gift_For_Horses_Trainers.csv", index = False)


# r=0
# desc=[]
# name=[]
# rating=[]
# image=[]
# price=[]
# id=[]
# brand=[]
# for i in personalised_horse_gifts_links:
#     print(r)
#     wd.get(i)
#     html_content = wd.page_source
#     soup = BeautifulSoup(html_content, 'html.parser')
#     try:
#         try:
#                 item_number = soup.find(id="productManufacturer").text
#                 item = re.findall(r'\d+', item_number)
#                 item_str = "".join(item)
#                 id.append(item_str)
#         except:
#                 id.append('')

#         #id
#         try:
#                 item_number = soup.find(id="productManufacturer").find('a').text
#                 # item = re.findall(r'\d+', item_number)
#                 # item_str = "".join(item)
#                 brand.append(item_number)
#         except:
#                 brand.append('')

#         # brand
#         try:
#                 des=soup.find(id="overview-section",class_="content-section").text.strip().replace("\n\n","").replace("   ","").replace("\n"," ")
#         except AttributeError:
#                 des=""
#         try:
#                 package_options=soup.find(class_="packagingOptions").text.strip().replace("\n\n\n\n","").replace("\n"," ").replace("/","").replace("   ","")
#         except AttributeError:
#                 package_options=""
#         try:
#                 det=soup.find(class_="pc-bg pc-bg-alt").text.strip().replace("\n\n\n","").replace("\n"," ").replace("   ","")
#         except AttributeError:
#                 det=""

#         joined = "".join([package_options,des,det])
#         desc.append(joined)
#         #desc
#         try:
#                 name.append(soup.find(class_="pc-info-title").text.strip())
#         except AttributeError:
#                 name.append(soup.find(class_="pageTitle").text.strip())
#         #name        
#         try:
#                 price.append(soup.find(class_="currentCost",attrs={'data-bind': 'text: costAfterAutoShip'}).text)
#         except AttributeError as e:
#                 try:
#                     price.append(soup.find(attrs={'data-bind': 'text: current'}).text)
#                 except AttributeError:
#                     price.append(soup.find(attrs={'data-bind': 'text: cost'}).text)
#         #price                
#         link=soup.find(id="image-control").find("img").get("src")
#         image.append("https:"+link)
#         #image    
#         try:
#                 rating.append(soup.find(itemprop="ratingValue").text)
#         except AttributeError:
#                 rating.append('0')

#         #rating  
#     except:
#         errorlist.append(i)

#     # print(name[r])
#     r=r+1

# # print(len(products))
# df_personalised_horse_gifts_links = pd.DataFrame(list(zip(id,name,rating,price,desc,image,personalised_horse_gifts_links,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
# df_personalised_horse_gifts_links.to_csv("Personalised_Horse_Gifts.csv", index = False)


# r=0
# desc=[]
# name=[]
# rating=[]
# image=[]
# price=[]
# id=[]
# brand=[]
# for i in gift_cretificates:
#     print(r)
#     wd.get(i)
#     html_content = wd.page_source
#     soup = BeautifulSoup(html_content, 'html.parser')
#     try:
#         try:
#                 item_number = soup.find(id="productManufacturer").text
#                 item = re.findall(r'\d+', item_number)
#                 item_str = "".join(item)
#                 id.append(item_str)
#         except:
#                 id.append('')

#         #id
#         try:
#                 item_number = soup.find(id="productManufacturer").find('a').text
#                 # item = re.findall(r'\d+', item_number)
#                 # item_str = "".join(item)
#                 brand.append(item_number)
#         except:
#                 brand.append('')

#         #brand
#         try:
#                 des=soup.find(id="overview-section",class_="content-section").text.strip().replace("\n\n","").replace("   ","").replace("\n"," ")
#         except AttributeError:
#                 des=""
#         try:
#                 package_options=soup.find(class_="packagingOptions").text.strip().replace("\n\n\n\n","").replace("\n"," ").replace("/","").replace("   ","")
#         except AttributeError:
#                 package_options=""
#         try:
#                 det=soup.find(class_="pc-bg pc-bg-alt").text.strip().replace("\n\n\n","").replace("\n"," ").replace("   ","")
#         except AttributeError:
#                 det=""

#         joined = "".join([package_options,des,det])
#         desc.append(joined)
#         #desc
#         try:
#                 name.append(soup.find(class_="pc-info-title").text.strip())
#         except AttributeError:
#                 name.append(soup.find(class_="pageTitle").text.strip())
#         #name        
#         try:
#                 price.append(soup.find(class_="currentCost",attrs={'data-bind': 'text: costAfterAutoShip'}).text)
#         except AttributeError as e:
#                 try:
#                     price.append(soup.find(attrs={'data-bind': 'text: current'}).text)
#                 except AttributeError:
#                     price.append(soup.find(attrs={'data-bind': 'text: cost'}).text)
#         #price                
#         link=soup.find(id="image-control").find("img").get("src")
#         image.append("https:"+link)
#         #image    
#         try:
#                 rating.append(soup.find(itemprop="ratingValue").text)
#         except AttributeError:
#                 rating.append('0')

#         #rating  
#     except:
#         errorlist.append(i)

#     # print(name[r])
#     r=r+1

# # print(len(products))
# df_gift_cretificates = pd.DataFrame(list(zip(id,name,rating,price,desc,image,gift_cretificates,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
# df_gift_cretificates.to_csv("Gift_Cetificates.csv", index = False)

r=0
desc=[]
name=[]
rating=[]
image=[]
price=[]
id=[]
brand=[]
for i in gift_for_dogs_links:
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
                item_number = soup.find(id="productManufacturer").find('a').text
                # item = re.findall(r'\d+', item_number)
                # item_str = "".join(item)
                brand.append(item_number)
        except:
                brand.append('')

        #brand
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
df_gift_for_dogs_links = pd.DataFrame(list(zip(id,name,rating,price,desc,image,gift_for_dogs_links,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
df_gift_for_dogs_links.to_csv("Gift_For_Dogs.csv", index = False)


r=0
desc=[]
name=[]
rating=[]
image=[]
price=[]
id=[]
brand=[]
for i in Treats_Toys_for_Horses_Gifts:
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
                item_number = soup.find(id="productManufacturer").find('a').text
                # item = re.findall(r'\d+', item_number)
                # item_str = "".join(item)
                brand.append(item_number)
        except:
                brand.append('')

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

    # print(name[r])
    r=r+1

# print(len(products))
df_Treats_Toys_for_Horses_Gifts = pd.DataFrame(list(zip(id,name,rating,price,desc,image,Treats_Toys_for_Horses_Gifts,brand)),columns=['Id','Product Name','Rating','Price','Description','Image_URL','Product_link','Brand'])
df_Treats_Toys_for_Horses_Gifts.to_csv("Treats_Toys_For_Horses_Gifts.csv", index = False)


