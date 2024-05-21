import pandas as pd

df_list=[]
# csv_list_path=["gift_for_dogs.csv"]
csv_list_path=["New_Barn_Supplies.csv","New_Equine_Supplements.csv","Save10.csv","New_Rider_Gear.csv","New_Rider_Apparel.csv","New_Horse_Gear.csv","New_Horse_Tack.csv"]

for csv in csv_list_path:
    str=csv.split('.')[0];
    str2=str.split('_')
    str3=' '.join(str2);
    if str=='NewRiderApparel2':
        str3='NewRiderApparel'
    df = pd.read_csv(csv)
    df2=df.assign(sub_category_1=str3,category='NEW')
    print(df2.columns)
    df_list.append(df2)
print("hi")
print(df_list)
big_df = pd.concat(df_list, ignore_index=True)
big_df.to_csv('NEW.csv', index=False)

