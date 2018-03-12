# ZBNFdashboard

## How to run
- Create a virtual env in python3 and activate it
```
virtualenv myenv -p python3
source myenv/bin/activate
```
- Clone the repository
```
git clone https://github.com/AMANVerma28/dashboard-client.git
```
- Install requirements using requirements.txt
```
cd dashboard-client
pip install -r requirements.txt
```
- Update pip packages
```
pip freeze --local | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip install -U
```
- Run the project
```
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
